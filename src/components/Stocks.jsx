import React, { useContext, useEffect } from "react";

import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./stores/stocks-store";

import StocksView from "./StocksView";

const Stocks = () => {
  const context = useContext(store);

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
    yearCheck,
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

  useEffect(() => {
    getStocks();
    // eslint-disable-next-line
  }, []);

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
        },
        { merge: true }
      )
      .then(() => {
        console.log("Document successfully written!");
        console.log(
          "profitBE - " + profitBE,
          "salary - " + salary,
          "taxOwed - " + taxOwed
        );
        context.dispatch({
          type: "updateShowTotal",
          payload: showTotal ? false : true,
        });
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
    context.dispatch({ type: "updateShowTotal", payload: false });
  };

  const calcTotal = () => {
    let profitArray = stocksList.map((item) => {
      return item.iProfit;
    });

    let totalIncome =
      profitArray.reduce((a, b) => a + b) + Math.round(Number(salary));
    context.dispatch({
      type: "updateTotalIncome",
      payload: totalIncome,
    });
    return totalIncome;
  };

  const calcTax = () => {
    //calc total income

    const checkedIncome = yearCheck ? calcTotal() / 2 : calcTotal();

    // tax Bracket Calcs

    if (checkedIncome > 180001) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.45 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 51667 + (checkedIncome - 180000) * taxBracket,
      });
    } else if (checkedIncome > 120000) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.37 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 29467 + (checkedIncome - 120000) * taxBracket,
      });
    } else if (checkedIncome > 45000) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.325 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: 5092 + (checkedIncome - 45000) * taxBracket,
      });
    } else if (checkedIncome > 18200) {
      context.dispatch({ type: "updateTaxBracket", payload: 0.19 });
      context.dispatch({
        type: "updateTaxOwed",
        payload: (checkedIncome - 18201) * taxBracket,
      });
    } else if (checkedIncome <= 18200) {
      context.dispatch({ type: "updateTaxBracket", payload: 0 });
      context.dispatch({ type: "updateTaxOwed", payload: 0 });
    }
    context.dispatch({
      type: "updateProfitBE",
      payload: checkedIncome - taxOwed,
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
    context.dispatch({ type: "updateYearCheck", payload: false });

    document.getElementById("yearCheckBox").checked = false;

    context.dispatch({ type: "updateShowTotal", payload: false });
  };

  const calculateProfit = (e) => {
    e.preventDefault();
    calcTax();
    //save to db & display
    saveStocks();
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
