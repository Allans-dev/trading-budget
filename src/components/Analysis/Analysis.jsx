import React, { useContext, useEffect } from "react";

import AnalysisView from "./AnalysisView";

import { store } from "./analsys-store";

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

  const switchBudget = () => {
    let restaurantArray,
      groceryArray,
      rentArray,
      houseArray = [];

    let restaurant = {};

    expenseArray.map((val, index) => {
      switch (val.category) {
        case "Restaurant":
          let restaurantArray = [];
          restaurant.category = "Restaurant";
          restaurantArray.push(val.cost);
          restaurant.totalCost = restaurantArray.reduce((a, b) => a + b);
          console.log(restaurantArray);
          break;
        case "Groceries":
          // groceryArray.push(val.cost);
          // groceryArray.reduce((a, b) => a + b);
          // console.log(groceryArray);
          break;
        case "Entertainment":
          break;
        case "Shopping":
          break;
        case "Rent/Mortgage":
          // rentArray.push(val.cost);
          // rentArray.reduce((a, b) => a + b);
          // console.log(rentArray);
          break;
        case "Hobby":
          break;
        case "Household":
          // houseArray.push(val.cost);
          // houseArray.reduce((a, b) => a + b);
          // console.log(houseArray);
          break;
        case "Transport":
          break;
        case "Education":
          break;
        case "Health":
          break;
        case "Other":
          break;
        default:
          break;
      }

      // return { "category" = restaurantArray, ...groceryArray, ...rentArray, ...houseArray };
    });
    return [restaurant];
  };

  console.log(sortedCost);

  console.log(switchBudget());

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

  console.log(budgetLabel);

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

  console.log(sortedCost);

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
