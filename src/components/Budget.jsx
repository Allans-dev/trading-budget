import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./store";

import ExpenseItem from "./ExpenseItem";

const Budget = () => {
  const [timeframe, setTimeframe] = useState("year");
  const [savingsRate, setSavingsRate] = useState(20);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [displayResults, setDisplayResults] = useState(false);

  const context = useContext(store);
  const { expenseArray } = context.state;

  let profit;
  let budget;
  let totalExpenses;
  let totalSavings;

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  if (isNaN(context.state.netProfit)) {
    profit = 0;
  } else {
    profit = context.state.netProfit;
  }

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
        type: "updateBudget",
        payload: await doc.data().budget,
      });
      context.dispatch({
        type: "updateSavings",
        payload: await doc.data().totalSavings,
      });
      context.dispatch({
        type: "updateNetProfit",
        payload: await doc.data().netProfit,
      });
      console.log("Document expenses:", doc.data());
    }
  };

  const saveBudget = async () => {
    const budgetDocRef = db.collection("users").doc(user.uid);
    await budgetDocRef.set(
      {
        expenseArray: expenseArray,
        budget: context.state.budget || null,
        totalExpenses: context.state.totalExpenses || null,
        totalSavings: context.state.totalSavings || null,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    getBudget();
    return saveBudget();
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
            description,
            cost,
          },
        ],
      });
    }

    if (context.state.profit) {
      console.log("context profit:" + profit);
    }
    setDisplayResults(false);
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
    setDisplayResults(false);
  };

  Array.isArray(expenseArray)
    ? (totalExpenses = expenseArray
        .map((item) => Number(item.cost))
        .reduce((a, b) => a + b))
    : (totalExpenses = 0);

  switch (timeframe) {
    case "day":
      budget = ((profit - totalExpenses) * (1 - savingsRate / 100)) / 365;
      totalSavings = ((profit - totalExpenses) * savingsRate) / 100 / 365;
      break;
    case "week":
      budget = ((profit - totalExpenses) * (1 - savingsRate / 100)) / 52;
      totalSavings = ((profit - totalExpenses) * savingsRate) / 100 / 52;
      break;
    case "month":
      budget = ((profit - totalExpenses) * (1 - savingsRate / 100)) / 12;
      totalSavings = ((profit - totalExpenses) * savingsRate) / 100 / 12;
      break;
    case "year":
      budget = (profit - totalExpenses) * (1 - savingsRate / 100);
      totalSavings = ((profit - totalExpenses) * savingsRate) / 100;
      console.log(totalSavings);
      break;
    default:
      break;
  }

  const calcBudget = async (e) => {
    e.preventDefault();

    context.dispatch({ type: "updateBudget", payload: budget });
    context.dispatch({ type: "updateSavings", payload: totalSavings });
    context.dispatch({ type: "totalExpenses", payload: totalExpenses });
    displayResults ? setDisplayResults(false) : setDisplayResults(true);
    saveBudget();
  };

  return (
    <article style={styles.budget}>
      <form style={styles.budgetForm} onSubmit={calcBudget}>
        <section style={styles.expense}>
          <label style={styles.label}>
            Description:{" "}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <br />
          <label style={styles.label}>
            Cost:{" "}
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </label>
        </section>
        <button style={styles.btnExpense} onClick={addExpenses}>
          +
        </button>
        <label>
          Current timeframe:{" "}
          <select
            id="timeframe"
            style={styles.timeframe}
            value={timeframe}
            onChange={(e) => {
              setTimeframe(e.target.value);
            }}
          >
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="fortnight">fortnight</option>
            <option value="month">month</option>
            <option value="year">year</option>
          </select>
        </label>
        <section style={styles.savings}>
          <label>
            <span style={{ display: "block" }}>Savings Rate</span>
            <input
              id="savings-rate"
              type="range"
              min={0}
              max={100}
              value={20}
              onChange={(e) => {
                setSavingsRate(e.target.value);
              }}
            ></input>
            <div>{savingsRate}%</div>
          </label>
        </section>

        <input style={styles.submit} type="submit" value="Save and Calculate" />
      </form>

      {Array.isArray(expenseArray) ? (
        <ul style={styles.ul}>
          {expenseArray.map((item, index) => {
            return (
              <ExpenseItem
                key={index}
                index={index}
                description={item.description}
                cost={item.cost}
                deleteListItem={deleteListItem}
              />
            );
          })}
        </ul>
      ) : null}

      {displayResults && budget > 0 ? (
        <div>NPAT: {profit}</div>
      ) : displayResults && totalExpenses > 0 ? (
        <div>Total Expenses: {context.state.totalExpenses}</div>
      ) : null}

      {displayResults && totalSavings > 0 ? (
        <div>
          Your total savings is {context.state.savings} per {timeframe}
        </div>
      ) : null}
    </article>
  );
};

const styles = {
  budget: { textAlign: "center" },
  budgetForm: {
    backgroundColor: "bisque",
    display: "inline-flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
  },
  btnExpense: {
    display: "block",
    marginTop: "2%",
  },
  timeframe: { marginTop: "5%" },
  savings: { marginTop: "5%" },
  btnSavings: {
    display: "block",
    width: "60%",
    marginLeft: "20%",
    marginTop: "2%",
  },
  submit: { marginTop: "5%" },
};

export default Budget;
