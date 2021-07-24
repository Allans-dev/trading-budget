import React, { useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./budget-store";

import BudgetView from "./BudgetView";

const Budget = () => {
  const context = useContext(store);
  const {
    expenseArray,
    grossProfit,
    savingsRate,
    totalExpenses,
    totalSavings,
    netProfit,
    timeframe,
    category,
    description,
    cost,
    displayResults,
  } = context.state;

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  const getBudget = async () => {
    const budgetRef = user ? db.collection("users").doc(user.uid) : null;
    const doc = user ? await budgetRef.get() : null;
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      context.dispatch({
        type: "updateExpenses",
        payload: await doc.data().expenseArray,
      });
      context.dispatch({
        type: "updateTotalSavings",
        payload: await doc.data().totalSavings,
      });
      context.dispatch({
        type: "updateNetProfit",
        payload: await doc.data().netProfit,
      });
      context.dispatch({
        type: "updateTotalExpenses",
        payload: await doc.data().totalExpenses,
      });
      console.log("Document budget:", doc.data());
    }
  };

  const saveBudget = async () => {
    const budgetDocRef = db.collection("users").doc(user.uid);
    await budgetDocRef.set(
      {
        expenseArray: expenseArray,
        totalExpenses: totalExpenses,
        totalSavings: totalSavings,
        netProfit: netProfit,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    getBudget();
    // eslint-disable-next-line
  }, []);

  const addExpenses = (e) => {
    e.preventDefault();
    if (Array.isArray(expenseArray)) {
      context.dispatch({
        type: "updateExpenses",
        payload: [
          ...expenseArray,
          {
            category,
            description,
            cost,
          },
        ],
      });
    } else {
      context.dispatch({
        type: "updateExpenses",
        payload: [
          {
            category,
            description,
            cost,
          },
        ],
      });
    }

    context.dispatch({ type: "updateDisplayResults", payload: false });
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
    switch (timeframe) {
      case "day":
        context.dispatch({
          type: "updateTotalSavings",
          payload: ((grossProfit - totalExpenses) * savingsRate) / 100 / 365,
        });
        context.dispatch({
          type: "updateNetProfit",
          payload:
            ((grossProfit - totalExpenses) * (1 - savingsRate / 100)) / 365,
        });
        break;
      case "week":
        context.dispatch({
          type: "updateTotalSavings",
          payload: ((grossProfit - totalExpenses) * savingsRate) / 100 / 52,
        });
        context.dispatch({
          type: "updateNetProfit",
          payload:
            ((grossProfit - totalExpenses) * (1 - savingsRate / 100)) / 52,
        });
        break;
      case "fortnight":
        context.dispatch({
          type: "updateTotalSavings",
          payload: ((grossProfit - totalExpenses) * savingsRate) / 100 / 26,
        });
        context.dispatch({
          type: "updateNetProfit",
          payload:
            ((grossProfit - totalExpenses) * (1 - savingsRate / 100)) / 26,
        });
        break;
      case "month":
        context.dispatch({
          type: "updateTotalSavings",
          payload: ((grossProfit - totalExpenses) * savingsRate) / 100 / 12,
        });
        context.dispatch({
          type: "updateNetProfit",
          payload:
            ((grossProfit - totalExpenses) * (1 - savingsRate / 100)) / 12,
        });
        break;
      case "year":
        context.dispatch({
          type: "updateTotalSavings",
          payload: ((grossProfit - totalExpenses) * savingsRate) / 100,
        });
        context.dispatch({
          type: "updateNetProfit",
          payload: (grossProfit - totalExpenses) * (1 - savingsRate / 100),
        });
        console.log(totalSavings);
        break;
      default:
        break;
    }
  };

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
