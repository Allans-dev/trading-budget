import React, { useContext, useEffect, useState, useCallback } from "react";

import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./stocks-store";

import StocksView from "./StocksView";

const Stocks = () => {
  const context = useContext(store);
  const [yearCheck, setYearCheck] = useState(false);
  // const [, updateState] = useState();
  // const forceUpdate = useCallback(() => updateState({}), []);
  // console.log(context);
  const {
    stocksList,
    profitBE,
    taxOwed,
    taxBracket,
    salary,
    stockName,
    sellPrice,
    buyPrice,
    volume,
    showTotal,
    totalIncome,
  } = context.state;

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  const getStocks = async () => {
    const listRef = db.collection("users").doc(user.uid);
    await listRef
      .get()
      .then((doc) => {
        context.dispatch({
          type: "updateStocksList",
          payload: doc.data().stocksList,
        });
        context.dispatch({
          type: "updateProfitBE",
          payload: doc.data().profitBE,
        });
        context.dispatch({
          type: "updateTotalIncome",
          payload: doc.data().totalIncome,
        });
        context.dispatch({
          type: "updateTaxOwed",
          payload: doc.data().taxOwed,
        });
        context.dispatch({
          type: "updateYearCheck",
          payload: doc.data().yearCheck,
        });
        context.dispatch({
          type: "updateSalary",
          payload: doc.data().salary,
        });
        context.dispatch({
          type: "updateTaxBracket",
          payload: doc.data().taxBracket,
        });
        console.log("Document stocks:", doc.data().stocksList);
      })
      .catch(() => {
        console.log("No such document!");
      });
  };

  const saveStocks = async () => {
    const totalsDocRef = db.collection("users").doc(user.uid);
    await totalsDocRef
      .set(
        {
          profitBE,
          taxOwed,
          stocksList,
          salary,
          taxBracket,
          totalIncome,
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

  useEffect(() => {
    getStocks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => () => saveStocks());

  function oneYearCheck() {
    yearCheck ? setYearCheck(false) : setYearCheck(true);
  }

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
    context.dispatch({ type: "updateShowTotal", payload: false });
  };

  const calcTaxBracket = (checkedIncome) => {
    context.dispatch({
      type: "updateTaxBracket",
      payload:
        checkedIncome > 180_001
          ? 0.45
          : checkedIncome > 120_001 && checkedIncome < 180_000
          ? 0.37
          : checkedIncome > 45_000 && checkedIncome < 120_000
          ? 0.325
          : checkedIncome > 18_201 && checkedIncome < 45_000
          ? 0.19
          : checkedIncome <= 18_200
          ? 0
          : 0,
    });
  };

  const calcTaxOwed = (checkedIncome) => {
    context.dispatch({
      type: "updateTaxOwed",
      payload:
        checkedIncome > 180_001 && checkedIncome < 180_000
          ? (checkedIncome - 180_000) * taxBracket + 51_667
          : checkedIncome > 120_000 && checkedIncome < 120_000
          ? (checkedIncome - 120_000) * taxBracket + 29_467
          : checkedIncome > 45_000 && checkedIncome < 45_000
          ? (checkedIncome - 45_000) * taxBracket + 5_092
          : checkedIncome > 18_201
          ? (checkedIncome - 18_201) * taxBracket
          : checkedIncome <= 18_200
          ? 0
          : 0,
    });
  };

  const addStocks = async (e) => {
    e.preventDefault();

    let calcIProfit = Number((sellPrice - buyPrice) * volume);
    const payload = Array.isArray(stocksList)
      ? [
          ...stocksList,
          {
            stockName,
            buyPrice,
            sellPrice,
            volume,
            yearCheck,
            iProfit: calcIProfit,
          },
        ]
      : [
          {
            stockName,
            buyPrice,
            sellPrice,
            volume,
            yearCheck,
            iProfit: calcIProfit,
          },
        ];

    context.dispatch({
      type: "updateStocksList",
      payload,
    });

    context.dispatch({ type: "updateStockName", payload: "" });
    context.dispatch({ type: "updateBuyPrice", payload: 0 });
    context.dispatch({ type: "updateSellPrice", payload: 0 });
    context.dispatch({ type: "updateVolume", payload: 0 });
    setYearCheck(false);

    document.getElementById("yearCheckBox").checked = false;

    context.dispatch({ type: "updateShowTotal", payload: false });
  };

  const calcTotal = () => {
    let profitArray = stocksList.map((item) => {
      return item.iProfit;
    });

    const stockTotal = profitArray.reduce((a, b) => a + b);

    let totalIncome = yearCheck
      ? stockTotal / 2 + Math.round(Number(salary))
      : stockTotal + Math.round(Number(salary));
    context.dispatch({
      type: "updateTotalIncome",
      payload: totalIncome,
    });

    return totalIncome;
  };

  const combine = () => {
    const checkedIncome = calcTotal();

    calcTaxBracket(checkedIncome);

    calcTaxOwed(checkedIncome);

    context.dispatch({
      type: "updateProfitBE",
      payload: checkedIncome - taxOwed,
    });
  };

  const calculateProfit = (e) => {
    e.preventDefault();
    combine();
    context.dispatch({
      type: "updateShowTotal",
      payload: showTotal ? false : true,
    });
  };

  return (
    <StocksView
      calculateProfit={calculateProfit}
      addStocks={addStocks}
      oneYearCheck={oneYearCheck}
      deleteListItem={deleteListItem}
    />
  );
};

export default Stocks;
