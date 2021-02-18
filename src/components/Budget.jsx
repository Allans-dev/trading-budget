import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import { store } from "./store";

import ExpenseItem from "./ExpenseItem";

const Budget = () => {
  const [timeframe, setTimeframe] = useState("year");
  const [category, setCategory] = useState("Groceries");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [displayResults, setDisplayResults] = useState(false);

  const context = useContext(store);
  const {
    expenseArray,
    netProfit,
    grossProfit,
    totalSavings,
    totalExpenses,
    savingsRate,
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

  const calcBudget = async (e) => {
    e.preventDefault();
    saveBudget();
    setNetProfitAndTotalSavings();
    calcTotalExpenses();
    displayResults ? setDisplayResults(false) : setDisplayResults(true);
  };

  return (
    <article style={styles.budget}>
      <form style={styles.budgetForm} onSubmit={calcBudget}>
        <section style={styles.expense}>
          <label style={styles.label}>
            Description:{" "}
            <select
              required
              id="description"
              style={styles.description}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="Restaurant">Restaurant</option>
              <option value="Groceries">Groceries</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Drinks">Drinks</option>
              <option value="Hobby">Hobby</option>
              <option value="Household">Household</option>
              <option value="Transport">Transport</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
            {category !== "Other" ? null : (
              <input
                type="text"
                value={description}
                style={styles.other}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}
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
              setDisplayResults(false);
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
              value={savingsRate}
              onChange={(e) => {
                context.dispatch({
                  type: "updateSavingsRate",
                  payload: e.target.value,
                });
                setDisplayResults(false);
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
            console.log(item);
            return (
              <ExpenseItem
                key={index}
                index={index}
                category={item.category}
                description={item.description}
                cost={item.cost}
                deleteListItem={deleteListItem}
              />
            );
          })}
        </ul>
      ) : null}

      {displayResults && netProfit > 0 ? (
        <div>
          <div>Total Expenses: {totalExpenses}</div>
          <div>
            Net Profit: {Math.round(netProfit * 100) / 100} per {timeframe}
          </div>
          <div>
            Your total savings is {Math.round(totalSavings * 100) / 100} per{" "}
            {timeframe}
          </div>
        </div>
      ) : displayResults && totalExpenses > 0 ? (
        <div>
          <div>Total Expenses: {totalExpenses}</div>
        </div>
      ) : null}
    </article>
  );
};

const styles = {
  budget: { textAlign: "center" },
  budgetForm: {
    backgroundColor: "bisque",
    maxWidth: "213px",
    display: "inline-flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
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
  other: {
    flex: "0 0 50%",
  },
};

export default Budget;
