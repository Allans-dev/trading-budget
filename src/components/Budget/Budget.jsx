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
    otherCategory,
  } = context.state;

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  const getBudget = async () => {
    if (user.uid) {
      const budgetRef = db.collection("users").doc(user.uid);
      await budgetRef
        .get()
        .then((doc) => {
          context.dispatch({
            type: "updateProfitBE",
            payload: doc.data().profitBE ? doc.data().profitBE : profitBE,
          });
          context.dispatch({
            type: "updateExpenses",
            payload: doc.data().expenseArray
              ? doc.data().expenseArray
              : expenseArray,
          });
          context.dispatch({
            type: "updateTotalSavings",
            payload: doc.data().totalSavings
              ? doc.data().totalSavings
              : totalSavings,
          });
          context.dispatch({
            type: "updateNetProfit",
            payload: doc.data().netProfit ? doc.data().netProfit : netProfit,
          });
          context.dispatch({
            type: "updateTotalExpenses",
            payload: doc.data().totalExpenses
              ? doc.data().totalExpenses
              : totalExpenses,
          });
        })
        .catch((error) => {
          console.log("no doc");
        });
    }
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
    // const eArray = setExpenseArray();
    console.log(expenseArray);
    context.dispatch({
      type: "updateExpenses",
      payload: Array.isArray(expenseArray)
        ? [
            ...expenseArray,
            {
              category: category !== "Other" ? category : otherCategory,
              description,
              cost,
            },
          ]
        : [
            {
              category: category !== "Other" ? category : otherCategory,
              description,
              cost,
            },
          ],
    });

    // context.dispatch({ type: "updateDisplayResults", payload: true });
    context.dispatch({ type: "updateDescription", payload: "" });
    context.dispatch({ type: "updateOtherCategory", payload: "" });
    saveBudget();
  };

  const deleteListItem = (id) => {
    // const expenseArray = setExpenseArray();

    if (expenseArray.length > 0) {
      context.dispatch({
        type: "updateExpenses",
        payload: expenseArray.filter((item, index) => {
          return index !== id;
        }),
      });
    }
    // context.dispatch({ type: "updateDisplayResults", payload: false });
  };

  const calcTotalExpenses = () => {
    // const expenseArray = setExpenseArray();
    console.log(expenseArray);
    const totalExpenses =
      expenseArray && expenseArray.length > 0
        ? expenseArray.map((item) => Number(item.cost)).reduce((a, b) => a + b)
        : 0;

    context.dispatch({
      type: "updateTotalExpenses",
      payload: totalExpenses,
    });

    return totalExpenses;
  };

  const calcTotalSavings = (totalE) => {
    const totalSavings = ((profitBE - totalE) * savingsRate) / 100;

    context.dispatch({
      type: "updateTotalSavings",
      payload: totalSavings,
    });
    return totalSavings;
  };

  const calcNetProfits = (totalE, totalS) => {
    const netProfit = profitBE - totalE - totalS;

    console.log(profitBE, totalExpenses, totalSavings);

    context.dispatch({
      type: "updateNetProfit",
      payload: netProfit,
    });

    return netProfit;
  };

  const combine = () => {
    const totalE = calcTotalExpenses();
    const totalS = calcTotalSavings(totalE);
    calcNetProfits(totalE, totalS);
  };

  const calcBudget = (e) => {
    e.preventDefault();
    combine();

    context.dispatch({
      type: "updateDisplayResults",
      payload: displayResults ? false : true,
    });
  };

  return (
    <BudgetView
      calcBudget={calcBudget}
      addExpenses={addExpenses}
      deleteListItem={deleteListItem}
    />
  );
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

export default Budget;
