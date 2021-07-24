import React, { useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./budget-store";

// import { store as Sstore } from "../stocksPage/stocks-store";

import BudgetView from "./BudgetView";

const Budget = () => {
  const context = useContext(store);
  const {
    expenseArray,
    profitBE,
    savingsRate,
    totalExpenses,
    totalSavings,
    netProfit,
    // timeFrame,
    category,
    description,
    cost,
    displayResults,
  } = context.state;

  console.log(profitBE);
  console.log(netProfit);
  console.log("======================");
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  const getBudget = async () => {
    const budgetRef = db.collection("users").doc(user.uid);
    await budgetRef
      .get()
      .then((doc) => {
        context.dispatch({
          type: "updateProfitBE",
          payload: doc.data().profitBE,
        });
        context.dispatch({
          type: "updateExpenses",
          payload: doc.data().expenseArray,
        });
        context.dispatch({
          type: "updateTotalSavings",
          payload: doc.data().totalSavings,
        });
        context.dispatch({
          type: "updateNetProfit",
          payload: doc.data().netProfit,
        });
        context.dispatch({
          type: "updateTotalExpenses",
          payload: doc.data().totalExpenses,
        });
        console.log("Document budget:", doc.data());
      })
      .catch((error) => {
        console.log("no doc");
      });
  };

  const saveBudget = async () => {
    const budgetDocRef = db.collection("users").doc(user.uid);
    await budgetDocRef
      .set(
        {
          expenseArray,
          totalExpenses,
          totalSavings,
          netProfit,
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
    getBudget();
    // eslint-disable-next-line
  }, []);

  useEffect(() => () => saveBudget());

  const addExpenses = (e) => {
    e.preventDefault();

    const payload = Array.isArray(expenseArray)
      ? [
          ...expenseArray,
          {
            category,
            description,
            cost,
          },
        ]
      : [{ category, description, cost }];

    context.dispatch({
      type: "updateExpenses",
      payload,
    });
    context.dispatch({ type: "updateDisplayResults", payload: true });
  };

  const deleteListItem = (id) => {
    if (expenseArray.length > 0) {
      context.dispatch({
        type: "updateExpenses",
        payload: expenseArray.filter((item, index) => {
          return index !== id;
        }),
      });
    }
    context.dispatch({ type: "updateDisplayResults", payload: false });
  };

  const calcTotalExpenses = () => {
    Array.isArray(expenseArray)
      ? context.dispatch({
          type: "updateTotalExpenses",
          payload: expenseArray
            .map((item) => Number(item.cost))
            .reduce((a, b) => a + b),
        })
      : context.dispatch({ type: "updateTotalExpenses", payload: 0 });
  };

  const setNetProfitAndTotalSavings = () => {
    context.dispatch({
      type: "updateTotalSavings",
      payload: ((profitBE - totalExpenses) * savingsRate) / 100,
    });
    context.dispatch({
      type: "updateNetProfit",
      payload: profitBE - totalExpenses - totalSavings,
    });
  };

  // const setNetProfitAndTotalSavings = () => {
  //   switch (timeFrame) {
  //     case "day":
  //       context.dispatch({
  //         type: "updateTotalSavings",
  //         payload: ((profitBE - totalExpenses) * savingsRate) / 100 / 365,
  //       });
  //       context.dispatch({
  //         type: "updateNetProfit",
  //         payload: ((profitBE - totalExpenses) * (1 - savingsRate / 100)) / 365,
  //       });
  //       break;
  //     case "week":
  //       context.dispatch({
  //         type: "updateTotalSavings",
  //         payload: ((profitBE - totalExpenses) * savingsRate) / 100 / 52,
  //       });
  //       context.dispatch({
  //         type: "updateNetProfit",
  //         payload: ((profitBE - totalExpenses) * (1 - savingsRate / 100)) / 52,
  //       });
  //       break;
  //     case "fortnight":
  //       context.dispatch({
  //         type: "updateTotalSavings",
  //         payload: ((profitBE - totalExpenses) * savingsRate) / 100 / 26,
  //       });
  //       context.dispatch({
  //         type: "updateNetProfit",
  //         payload: ((profitBE - totalExpenses) * (1 - savingsRate / 100)) / 26,
  //       });
  //       break;
  //     case "month":
  //       context.dispatch({
  //         type: "updateTotalSavings",
  //         payload: ((profitBE - totalExpenses) * savingsRate) / 100 / 12,
  //       });
  //       context.dispatch({
  //         type: "updateNetProfit",
  //         payload: ((profitBE - totalExpenses) * (1 - savingsRate / 100)) / 12,
  //       });
  //       break;
  //     case "year":
  //       context.dispatch({
  //         type: "updateTotalSavings",
  //         payload: ((profitBE - totalExpenses) * savingsRate) / 100,
  //       });
  //       context.dispatch({
  //         type: "updateNetProfit",
  //         payload: (profitBE - totalExpenses) * (1 - savingsRate / 100),
  //       });
  //       // console.log(totalSavings);
  //       break;
  //     default:
  //       context.dispatch({
  //         type: "updateTotalSavings",
  //         payload: ((profitBE - totalExpenses) * savingsRate) / 100,
  //       });
  //       context.dispatch({
  //         type: "updateNetProfit",
  //         payload: profitBE - totalExpenses - totalSavings,
  //       });
  //       break;
  //   }
  // };

  const calcBudget = (e) => {
    e.preventDefault();
    saveBudget();
    setNetProfitAndTotalSavings();
    calcTotalExpenses();
    displayResults
      ? context.dispatch({ type: "updateDisplayResults", payload: false })
      : context.dispatch({ type: "updateDisplayResults", payload: true });
  };

  return (
    <BudgetView
      calcBudget={calcBudget}
      addExpenses={addExpenses}
      deleteListItem={deleteListItem}
    />
  );
};

export default Budget;
