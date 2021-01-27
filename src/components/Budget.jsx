import React, { useState, useContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./store";

import ExpenseItem from "./ExpenseItem";

const Budget = () => {
  const [timeframe, setTimeframe] = useState("year");
  const [savingsRate, setSavingsRate] = useState(50);
  const [description, setDescription] = useState("groceries");
  const [cost, setCost] = useState(40.0);
  const [expenseArray, setExpenseArray] = useState([]);
  const [displayResults, setDisplayResults] = useState(false);

  const globalState = useContext(store);
  let profit;

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  if (isNaN(globalState.state.profit)) {
    profit = 0;
  } else {
    profit = globalState.state.profit;
  }

  let budget;
  let totalExpense;
  let totalSavings;

  const addExpense = (e) => {
    e.preventDefault();
    setExpenseArray([
      ...expenseArray,
      {
        description,
        cost,
      },
    ]);
    if (globalState.state.profit) {
      console.log("globalStateprofit:" + profit);
    }
    setDisplayResults(false);
  };

  const deleteListItem = (id) => {
    if (expenseArray.length > 0) {
      setExpenseArray(
        expenseArray.filter((item, index) => {
          return index !== id;
        })
      );
    }
    setDisplayResults(false);
  };

  expenseArray.length > 0
    ? (totalExpense = expenseArray
        .map((item) => item.cost)
        .reduce((a, b) => a + b))
    : (totalExpense = 0);

  switch (timeframe) {
    case "day":
      budget = ((profit - totalExpense) * (1 - savingsRate / 100)) / 365;
      totalSavings = ((profit - totalExpense) * savingsRate) / 100 / 365;
      break;
    case "week":
      budget = ((profit - totalExpense) * (1 - savingsRate / 100)) / 52;
      totalSavings = ((profit - totalExpense) * savingsRate) / 100 / 52;
      break;
    case "month":
      budget = ((profit - totalExpense) * (1 - savingsRate / 100)) / 12;
      totalSavings = ((profit - totalExpense) * savingsRate) / 100 / 12;
      break;
    case "year":
      budget = (profit - totalExpense) * (1 - savingsRate / 100);
      totalSavings = ((profit - totalExpense) * savingsRate) / 100;
      break;
    default:
      break;
  }

  const calcBudget = async (e) => {
    e.preventDefault();
    globalState.dispatch({ type: "addNPAT", payload: budget });
    globalState.dispatch({ type: "addSavings", payload: totalSavings });
    globalState.dispatch({ type: "addExpenses", payload: totalExpense });
    displayResults ? setDisplayResults(false) : setDisplayResults(true);
    const budgetDocRef = db.collection("users").doc(user.uid);
    await budgetDocRef.set(
      {
        budget: budget,
        totalExpense: totalExpense,
        totalSavings: totalSavings,
        expenseArray: expenseArray,
      },
      { merge: true }
    );
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
        <button style={styles.btnExpense} onClick={addExpense}>
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
              onChange={(e) => {
                setSavingsRate(e.target.value);
              }}
            ></input>
            <div>{savingsRate}%</div>
          </label>
        </section>

        <input style={styles.submit} type="submit" value="Calculate Budget" />
      </form>

      {expenseArray.length > 0 ? (
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
        <div>NPAT: {budget}</div>
      ) : displayResults && totalExpense > 0 ? (
        <div>Total Expenses: {totalExpense}</div>
      ) : null}

      {displayResults && totalSavings > 0 ? (
        <div>
          Your total savings is {totalSavings} per {timeframe}
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
