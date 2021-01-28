import React, { useState, useContext, useEffect } from "react";

import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./store";

import StocksListItem from "./StocksListItem";

// save to database after switching tabs or logout, read from reducer to enable faster loading

const Stocks = (props) => {
  const [stockName, setStockName] = useState("VUL");
  const [buyPrice, setBuyPrice] = useState(10);
  const [sellPrice, setSellPrice] = useState(20);
  const [volume, setVolume] = useState(100);
  const [showTotal, setShowTotal] = useState(false);
  const [yearCheck, setYearCheck] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(45000);

  const globalState = useContext(store);

  const { stocksList } = globalState.state;
  console.log(globalState);

  let stockIncome;
  let taxableIncome;
  let taxOwed;
  let netProfit;
  let taxBracket;

  console.log("====================================");

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  async function getData() {
    const listRef = db.collection("users").doc(user.uid);
    const doc = await listRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      globalState.dispatch({
        type: "updateStocksList",
        payload: await doc.data().stocksList,
      });
      console.log("Document data:", doc.data());
    }
  }

  useEffect(() => {
    getData();
  }, [showTotal]);

  const oneYearCheck = () => {
    yearCheck ? setYearCheck(false) : setYearCheck(true);
  };

  const deleteListItem = (id) => {
    if (stocksList.length > 0) {
      globalState.dispatch({
        type: "deleteFromStocksList",
        payload: stocksList.filter((item, index) => {
          return index + item.stockName !== id;
        }),
      });
    }
    setShowTotal(false);
  };

  if (yearCheck) {
    stockIncome = ((Number(sellPrice) - Number(buyPrice)) * Number(volume)) / 2;
  } else {
    stockIncome = (Number(sellPrice) - Number(buyPrice)) * Number(volume);
  }

  if (stocksList.length > 0) {
    let stockIncomeArray = stocksList.map((item) => {
      return item.stockIncome;
    });
    taxableIncome =
      stockIncomeArray.reduce((a, b) => a + b) +
      Math.round(Number(annualIncome));
  } else {
    console.log(taxableIncome);
  }

  if (taxableIncome <= 18200) {
    taxOwed = 0;
  }
  if (taxableIncome > 18200 && taxableIncome < 45001) {
    taxBracket = 0.19;
    taxOwed = (taxableIncome - 18201) * taxBracket;
  }
  if (taxableIncome > 45000 && taxableIncome < 120001) {
    taxBracket = 0.325;
    taxOwed = 5092 + (taxableIncome - 45000) * taxBracket;
  }
  if (taxableIncome > 120000 && taxableIncome <= 180000) {
    taxBracket = 0.37;
    taxOwed = 29467 + (taxableIncome - 120000) * taxBracket;
  }
  if (taxableIncome > 180001) {
    taxBracket = 0.45;
    taxOwed = 51667 + (taxableIncome - 180000) * taxBracket;
  }

  netProfit = taxableIncome - taxOwed;

  const addStocks = async (e) => {
    e.preventDefault();
    globalState.dispatch({
      type: "updateStocksList",
      payload: [
        ...stocksList,
        {
          stockName,
          buyPrice,
          sellPrice,
          volume,
          yearCheck,
          stockIncome,
        },
      ],
    });
    setStockName("");
    setBuyPrice(0);
    setSellPrice(0);
    setVolume(0);
    setYearCheck(false);
    document.getElementById("yearCheckBox").checked = false;
    setShowTotal(false);
  };

  const calculateProfit = async (e) => {
    e.preventDefault();

    globalState.dispatch({ type: "newTotal", payload: netProfit });
    console.log(globalState);

    const totalsDocRef = db.collection("users").doc(user.uid);
    await totalsDocRef.set(
      {
        taxOwed: taxOwed,
        netProfit: netProfit,
        stocksList: stocksList,
        taxableIncome: taxableIncome,
        taxBracket: taxBracket || 0,
        annualIncome: annualIncome || 0,
      },
      { merge: true }
    );
    showTotal ? setShowTotal(false) : setShowTotal(true);
  };

  return (
    <article style={styles.article}>
      <section style={styles.formSection}>
        <form style={styles.form} onSubmit={addStocks}>
          <label style={styles.label}>
            Share Name:
            <input
              type="text"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              required
            />
          </label>
          <label style={styles.label}>
            Unit Price (Bought):
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              required
            />
          </label>
          <label style={styles.label}>
            Unit Price (Sold):
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              required
            />
          </label>
          <label style={styles.label}>
            Number of Shares:
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              required
            />
          </label>
          <label style={styles.left}>
            Held more than 1 year?{" "}
            <input type="checkbox" id="yearCheckBox" onClick={oneYearCheck} />
          </label>

          <input type="submit" value="Add Shares" />

          <label style={styles.label}>
            Annual Income:
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
            />
          </label>

          <button onClick={calculateProfit}>Calculate Profit</button>
        </form>
      </section>

      {stocksList.length > 0 ? (
        <ul style={styles.ul}>
          {stocksList.map((item, index) => {
            return (
              <StocksListItem
                key={index}
                index={index}
                stockName={item.stockName}
                buyPrice={item.buyPrice}
                sellPrice={item.sellPrice}
                volume={item.volume}
                yearCheck={item.yearCheck}
                deleteListItem={deleteListItem}
              />
            );
          })}
        </ul>
      ) : null}

      {showTotal ? (
        <div style={styles.profit}>
          <div>
            Taxable Income ={" "}
            {taxableIncome > 0
              ? Math.round((taxableIncome + Number.EPSILON) * 100) / 100
              : 0}
          </div>
          <div>
            Income tax Owed ={" "}
            {taxOwed > 0
              ? Math.round((taxOwed + Number.EPSILON) * 100) / 100
              : 0}
          </div>
          <div>
            Profit = {Math.round((netProfit + Number.EPSILON) * 100) / 100}
          </div>
          <aside style={styles.aside}>
            The above rates do not include the Medicare levy of 2% or any low
            income offsets.
          </aside>
        </div>
      ) : null}
    </article>
  );
};

const styles = {
  article: { textAlign: "center" },
  formSection: {
    display: "flex",
    justifyContent: "center",
  },
  form: {
    backgroundColor: "bisque",
    display: "inline-flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  left: {
    textAlign: "left",
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
  },
  ul: {
    backgroundColor: "bisque",
    padding: 0,
  },
  profit: {
    display: "block",
  },
  aside: {
    margin: "10px",
  },
};

export default Stocks;
