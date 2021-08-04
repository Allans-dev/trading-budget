import React, { useContext, useEffect } from "react";

import AnalysisView from "./AnalysisView";

import { store } from "./analysis-store";

import firebase from "firebase/app";
import "firebase/firestore";

const Analysis = () => {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  const context = useContext(store);
  const { stocksList, expenseArray } = context.state;

  const getAnalysisData = async () => {
    const listRef = db.collection("users").doc(user.uid);
    await listRef
      .get()
      .then((doc) => {
        context.dispatch({
          type: "updateStocksList",
          payload: doc.data().stocksList,
        });
        context.dispatch({
          type: "updateExpenses",
          payload: doc.data().expenseArray,
        });
        console.log("Document stocks:", doc.data().stocksList);
      })
      .catch(() => {
        console.log("No such document!");
      });
  };

  useEffect(() => {
    getAnalysisData();
    // eslint-disable-next-line
  }, []);

  const sampleData = [
    { x: "Cats", y: 35 },
    { x: "Dogs", y: 40 },
    { x: "Birds", y: 55 },
  ];

  const sortedCost = expenseArray.sort((a, b) => {
    var nameA = a.category.toUpperCase(); // ignore upper and lowercase
    var nameB = b.category.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  const singleExpenseLabel = sortedCost.map((val, index) => {
    const prev = index - 1 >= 0 ? index - 1 : 0;

    return val.category !== sortedCost[prev].category || index === 0
      ? val.category
      : null;
  });

  const filteredExpenseLabel = singleExpenseLabel.filter((val, index) => {
    return val !== null;
  });

  const totalObj = {};
  const arr = [];

  const a = filteredExpenseLabel.map((val, index) => {
    sortedCost.map((val2, index2) => {
      let temp = {};
      if (val === val2.category) {
        temp[val2.category] = val2.cost;
        arr.push(temp);
      }
      temp = {};
    });

    return arr;
  });

  const result = (b) => {
    b.forEach((list) => {
      for (let [key, value] of Object.entries(list)) {
        if (totalObj[key]) {
          totalObj[key] += value;
        } else totalObj[key] = value;
      }
    });
    return totalObj;
  };

  console.log(result(a[0]));

  const budgetData =
    sortedCost.length > 0
      ? sortedCost.map((val, index) => {
          return {
            x: val.cost,
            y: val.cost,
          };
        })
      : 0;

  const budgetLabel2 =
    filteredExpenseLabel.length > 0
      ? filteredExpenseLabel.map((val, index) => {
          return { x: val, y: val };
        })
      : null;

  const budgetLabel =
    sortedCost.length > 0
      ? sortedCost.map((val, index) => {
          return {
            x: val.category,
            y: val.cost,
          };
        })
      : 0;

  const sortedStocks = stocksList.sort((a, b) => {
    var nameA = a.stockName.toUpperCase(); // ignore upper and lowercase
    var nameB = b.stockName.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  const stocksLabel =
    sortedStocks.length > 0
      ? sortedStocks.map((val, index) => {
          return { x: val.iProfit, y: val.iProfit };
        })
      : 0;

  const stocksData =
    sortedStocks.length > 0
      ? sortedStocks.map((val, index) => {
          return { x: val.stockName, y: val.iProfit };
        })
      : 0;

  return (
    <AnalysisView
      sampleData={sampleData}
      stocksData={stocksData}
      stocksLabel={stocksLabel}
      budgetData={budgetData}
      budgetLabel={budgetLabel2}
    />
  );
};

export default Analysis;
