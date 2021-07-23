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
  const [salary, setSalary] = useState(0);

  const context = useContext(store);

  const { stocksList, profitBE, taxOwed, taxBracket, totalIncome } =
    context.state;

  const { iProfit, yearCheck } =
    !Array.isArray(context.state.stocksList) ||
    context.state.stocksList.length === 0
      ? { iProfit: 0, yearCheck: false }
      : context.state.stocksList[0];

  console.log(yearCheck);

  console.log("====================================");

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  const getStocks = async () => {
    const listRef = db.collection("users").doc(user.uid);
    const doc = await listRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      context.dispatch({
        type: "updateStocksList",
        payload: await doc.data().stocksList,
      });
      context.dispatch({
        type: "updateProfitBE",
        payload: await doc.data().profitBE,
      });
      context.dispatch({
        type: "updateTotalIncome",
        payload: (await doc.data().income) || 0,
      });
      context.dispatch({
        type: "updateTaxOwed",
        payload: (await doc.data().taxOwed) || 0,
      });
      context.dispatch({
        type: "updateYearCheck",
        payload: await doc.data().yearCheck,
      });
      context.dispatch({
        type: "updateIProfit",
        payload: await doc.data().iProfit,
      });
      console.log("Document stocks:", doc.data().stocksList);
    }
  };

  useEffect(() => {
    getStocks();
    // eslint-disable-next-line
  }, []);

  const saveStocks = async () => {
    console.log(iProfit);
    const totalsDocRef = db.collection("users").doc(user.uid);
    await totalsDocRef
      .set(
        {
          profitBE,
          taxOwed,
          stocksList,
          iProfit,
          taxBracket,
        },
        { merge: true }
      )
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const oneYearCheck = () => {
    yearCheck
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
    saveStocks();
    setShowTotal(false);
  };

  const setIncomes = () => {
    let profitArray = stocksList.map((item) => {
      return item.iProfit;
    });
    context.dispatch({
      type: "updateTotalIncome",
      payload: profitArray.reduce((a, b) => a + b) + Math.round(Number(salary)),
    });
  };

  const calcTax = () => {
    const checkedIncome = yearCheck ? totalIncome / 2 : totalIncome;

    if (checkedIncome <= 18200) {
      context.dispatch({ type: "updateTaxBracket", payload: taxBracket });
      context.dispatch({ type: "updateTaxOwed", payload: 0 });
      context.dispatch({
        type: "updateProfitBE",
        payload: checkedIncome - taxOwed,
      });
    }
    if (checkedIncome > 18200 && checkedIncome < 45001) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.19 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: (checkedIncome - 18201) * taxBracket,
      });
      context.dispatch({
        type: "updateProfitBE",
        payload: checkedIncome - taxOwed,
      });
    }
    if (checkedIncome > 45000 && checkedIncome < 120001) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.325 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 5092 + (checkedIncome - 45000) * taxBracket,
      });
      context.dispatch({
        type: "updateProfitBE",
        payload: checkedIncome - taxOwed,
      });
    }
    if (checkedIncome > 120000 && checkedIncome <= 180000) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.37 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 29467 + (checkedIncome - 120000) * taxBracket,
      });
      context.dispatch({
        type: "updateProfitBE",
        payload: checkedIncome - taxOwed,
      });
    }
    if (checkedIncome > 180001) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.45 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 51667 + (checkedIncome - 180000) * taxBracket,
      });
      context.dispatch({
        type: "updateProfitBE",
        payload: checkedIncome - taxOwed,
      });
    }
  };

  const addStocks = async (e) => {
    e.preventDefault();

    let calcIProfit = (sellPrice - buyPrice) * volume;

    context.dispatch({
      type: "updateIProfit",
      payload: calcIProfit,
    });

    const payload = Array.isArray(stocksList)
      ? [
          ...stocksList,
          {
            stockName,
            buyPrice,
            sellPrice,
            volume,
            yearCheck,
            iProfit,
          },
        ]
      : [
          {
            stockName,
            buyPrice,
            sellPrice,
            volume,
            yearCheck,
            iProfit,
          },
        ];

    context.dispatch({
      type: "updateStocksList",
      payload,
    });
    setStockName("");
    setBuyPrice(0);
    setSellPrice(0);
    setVolume(0);
    context.dispatch({ type: "updateYearCheck", payload: false });
    document.getElementById("yearCheckBox").checked = false;
    setShowTotal(false);
  };

  const calculateProfit = (e) => {
    e.preventDefault();
    setIncomes();
    calcTax();

    showTotal ? setShowTotal(false) : setShowTotal(true);
    saveStocks();
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
            Annual income:
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
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
          <div>Total Income: {totalIncome}</div>
          <div>
            income tax Owed: {taxOwed > 0 ? Math.round(taxOwed * 100) / 100 : 0}
          </div>
          <div>Take-home profits: {profitBE}</div>
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
