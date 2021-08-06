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

  const categoryArray = sortedCost
    .map((val, index) => {
      const prev = index - 1 >= 0 ? index - 1 : 0;

      return val.category !== sortedCost[prev].category || index === 0
        ? val.category
        : null;
    })
    .filter((val, index) => {
      return val !== null;
    });

  const extractKeyValues = (keyList, masterList, keyNameOne, keyNameTwo) => {
    const array = [];
    keyList.map((val) => {
      masterList.map((val2) => {
        let temp = {};
        if (val === val2[keyNameOne]) {
          temp[val2[keyNameOne]] = val2[keyNameTwo];
          array.push(temp);
        }
        temp = {};
      });
    });
    return array;
  };

  const budgetKeyValues = extractKeyValues(
    categoryArray,
    sortedCost,
    "category",
    "cost"
  );

  const addValuesIntoObject = (arr) => {
    let obj = {};
    arr.forEach((list) => {
      for (let [key, value] of Object.entries(list)) {
        if (obj[key]) {
          obj[key] += value;
        } else obj[key] = value;
      }
    });
    return obj;
  };

  const totalExpenseByCaterory = addValuesIntoObject(budgetKeyValues);

  const keyValueToCoords = (obj) => {
    const arr = [];
    for (const key in obj) {
      arr.push({ x: key, y: obj[key] });
    }
    return arr;
  };

  //===============================================================

  const budgetInner = keyValueToCoords(totalExpenseByCaterory);

  const budgetOuter =
    sortedCost.length > 0
      ? sortedCost.map((val, index) => {
          return {
            x: val.cost,
            y: val.cost,
          };
        })
      : [];

  //===============================================================

  const sortedStocks = stocksList.sort((a, b) => {
    return b.iProfit - a.iProfit;
  });

  const StockNameArray = stocksList
    .map((val, index) => {
      const prev = index - 1 >= 0 ? index - 1 : 0;

      return val.stockName !== stocksList[prev].stockName || index === 0
        ? val.stockName
        : null;
    })
    .filter((val, index) => {
      return val !== null;
    });

  const stocksKeyValues = extractKeyValues(
    StockNameArray,
    stocksList,
    "stockName",
    "iProfit"
  );

  const addSelectedValuesIntoObject = (arr) => {
    let obj = { profit: 0, loss: 0 };
    arr.forEach((list) => {
      for (let [key, value] of Object.entries(list)) {
        if (value >= 0) {
          obj.profit += value;
        } else obj.loss += value;
      }
    });
    obj.loss *= -1;
    return obj;
  };

  const nameProfitObject = addSelectedValuesIntoObject(stocksKeyValues);

  //===============================================================

  const stocksInner = keyValueToCoords(nameProfitObject);

  const stocksOuter =
    sortedStocks.length > 0
      ? sortedStocks.map((val, index) => {
          return {
            x: val.stockName + " " + val.iProfit,
            y: val.iProfit > 0 ? val.iProfit : val.iProfit * -1,
            profit: val.iProfit > 0 ? true : false,
          };
        })
      : [];

  //===============================================================

  return (
    <AnalysisView
      stocksOuter={stocksOuter}
      stocksInner={stocksInner}
      budgetOuter={budgetOuter}
      budgetInner={budgetInner}
    />
  );
};

export default Analysis;
