import React, { useState, useContext, useEffect } from "react";

import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./store";

import StocksListItem from "./StocksListItem";

const Stocks = () => {
  const [stockName, setStockName] = useState("");
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [volume, setVolume] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(0);

  const context = useContext(store);
  const {
    stocksList,
    grossProfit,
    taxOwed,
    taxBracket,
    taxableIncome,
  } = context.state;
  console.log(context);

  let stockIncome;

  console.log("====================================");

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  const getStocks = async () => {
    const listRef = await db.collection("users").doc(user.uid);
    const doc = await listRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      context.dispatch({
        type: "updateStocksList",
        payload: await doc.data().stocksList,
      });
      console.log("Document stocks:", doc.data().stocksList);
    }
  };

  const saveStocks = async () => {
    const totalsDocRef = db.collection("users").doc(user.uid);
    await totalsDocRef.set(
      {
        grossProfit: grossProfit,
        taxOwed: taxOwed,
        stocksList: stocksList,
        taxableIncome: taxableIncome,
        taxBracket: taxBracket,
        annualIncome: annualIncome,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    getStocks();
    return saveStocks();
    // eslint-disable-next-line
  }, []);

  const oneYearCheck = () => {
    context.yearCheck
      ? context.dispatch({ type: "updateYearCheck", payload: false })
      : context.dispatch({ type: "updateYearCheck", payload: true });
  };

  const deleteListItem = (id) => {
    if (stocksList.length > 0) {
      context.dispatch({
        type: "updateStocksList",
        payload: stocksList.filter((item, index) => {
          return index + item.stockName !== id;
        }),
      });
    }
    setShowTotal(false);
  };

  const setStockIncome = () => {
    if (context.yearCheck) {
      stockIncome =
        ((Number(sellPrice) - Number(buyPrice)) * Number(volume)) / 2;
    } else {
      stockIncome = (Number(sellPrice) - Number(buyPrice)) * Number(volume);
    }
  };

  const setTaxableIncome = () => {
    if (Array.isArray(stocksList)) {
      let stockIncomeArray = stocksList.map((item) => {
        return item.stockIncome;
      });
      context.dispatch({
        type: "updateTaxableIncome",
        payload:
          stockIncomeArray.reduce((a, b) => a + b) +
          Math.round(Number(annualIncome)),
      });
    } else {
      console.log(taxableIncome);
    }
  };

  const calcTax = () => {
    if (taxableIncome <= 18200) {
      context.dispatch({ type: "updateTaxBracket", payload: taxBracket });
      context.dispatch({ type: "updateTaxOwed", payload: 0 });
    }
    context.dispatch({
      type: "updateGrossProfit",
      payload: taxableIncome - taxOwed,
    });
    if (taxableIncome > 18200 && taxableIncome < 45001) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.19 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: (taxableIncome - 18201) * taxBracket,
      });
      context.dispatch({
        type: "updateGrossProfit",
        payload: taxableIncome - taxOwed,
      });
    }
    if (taxableIncome > 45000 && taxableIncome < 120001) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.325 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 5092 + (taxableIncome - 45000) * taxBracket,
      });
      context.dispatch({
        type: "updateGrossProfit",
        payload: taxableIncome - taxOwed,
      });
    }
    if (taxableIncome > 120000 && taxableIncome <= 180000) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.37 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 29467 + (taxableIncome - 120000) * taxBracket,
      });
      context.dispatch({
        type: "updateGrossProfit",
        payload: taxableIncome - taxOwed,
      });
    }
    if (taxableIncome > 180001) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.45 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 51667 + (taxableIncome - 180000) * taxBracket,
      });
      context.dispatch({
        type: "updateGrossProfit",
        payload: taxableIncome - taxOwed,
      });
    }
  };

  console.log(typeof taxableIncome + taxableIncome);
  console.log(typeof taxOwed + taxOwed);

  const addStocks = async (e) => {
    e.preventDefault();
    context.dispatch({
      type: "updateStocksList",
      payload: [
        ...stocksList,
        {
          stockName,
          buyPrice,
          sellPrice,
          volume,
          yearCheck: context.yearCheck,
          stockIncome,
        },
      ],
    });
    setStockName("");
    setBuyPrice(0);
    setSellPrice(0);
    setVolume(0);
    context.dispatch({ type: "updateYearCheck", payload: false });
    document.getElementById("yearCheckBox").checked = false;
    setShowTotal(false);
  };

  const calculateProfit = async (e) => {
    e.preventDefault();
    setStockIncome();
    setTaxableIncome();
    calcTax();
    saveStocks();
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

          <button onClick={calculateProfit}>Save and Calculate</button>
        </form>
      </section>

      {Array.isArray(stocksList) ? (
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
            Gross Profit ={" "}
            {Math.round((grossProfit + Number.EPSILON) * 100) / 100}
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
  article: { textAlign: "center", paddingBottom: "58px" },
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
