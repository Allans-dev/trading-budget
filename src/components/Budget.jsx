import React, { useState, useContext } from "react";

import { store } from "./store";

import ExpenseItem from "./ExpenseItem";

const Budget = () => {
  const [timeframe, setTimeframe] = useState("month");
  const [savingsRate, setSavingsRate] = useState(50);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [expenseArray, setExpenseArray] = useState([]);

  const globalState = useContext(store);
  const NPAT = globalState.state;

  const addExpense = (e) => {
    e.preventDefault();
    setExpenseArray([
      ...expenseArray,
      {
        description,
        cost,
      },
    ]);
    if (globalState.state.NPAT) {
      console.log("globalStateNPAT:" + NPAT);
    }
  };

  const deleteListItem = (id) => {
    if (expenseArray.length > 0) {
      setExpenseArray(
        expenseArray.filter((item, index) => {
          return index !== id;
        })
      );
    }
  };

  const calcBudget = (e) => {
    e.preventDefault();
    switch (timeframe) {
      case "day":
        break;
      case "week":
        break;
      case "month":
        break;
      case "total":
        break;
      default:
        break;
    }
  };

  return (
    <article style={styles.budget}>
      <form style={styles.budgetForm} onSubmit={calcBudget}>
        <section style={styles.expense}>
          <label style={styles.label}>
            Description:{" "}
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <br />
          <label style={styles.label}>
            Cost:{" "}
            <input type="number" onChange={(e) => setCost(e.target.value)} />
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
            onChange={(e) => {
              setTimeframe(e.target.value);
            }}
            defaultValue="total"
          >
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="fortnight">fortnight</option>
            <option value="month">month</option>
            <option value="total">total</option>
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
          {/* <button style={styles.btnSavings} onClick={handleSavings}>
            +
          </button> */}
        </section>

        <input style={styles.submit} type="submit" value="Calculate Budget" />
      </form>

      {/* <div>{total}</div> */}

      {expenseArray.length > 0 ? (
        <ul style={styles.ul}>
          {expenseArray.map((item, index) => {
            return (
              <ExpenseItem
                key={index}
                index={index}
                description={description}
                cost={cost}
                deleteListItem={deleteListItem}
              />
            );
          })}
        </ul>
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
