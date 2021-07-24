import React, { useContext } from "react";

import { store } from "./budget-store";

import ExpenseItem from "./ExpenseItem";

const BudgetView = (props) => {
  const context = useContext(store);
  const {
    // timeFrame,
    category,
    description,
    cost,
    expenseArray,
    savingsRate,
    totalExpenses,
    totalSavings,
    netProfit,
    displayResults,
  } = context.state;

  // console.log(timeFrame);

  const { calcBudget, addExpenses, deleteListItem } = props;

  return (
    <article style={styles.budget}>
      <form style={styles.budgetForm} onSubmit={calcBudget}>
        <section style={styles.expense}>
          <label style={styles.label}>
            Description:{" "}
            <select
              required
              id="category"
              style={styles.category}
              value={category}
              onChange={(e) => {
                context.dispatch({
                  type: "updateCategory",
                  payload: e.target.value,
                });
              }}
            >
              <option value="Restaurant">Restaurant</option>
              <option defaultValue value="Groceries">
                Groceries
              </option>
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
                onChange={(e) =>
                  context.dispatch({
                    type: "updateDescription",
                    payload: e.target.value,
                  })
                }
              />
            )}
          </label>
          <br />
          <label style={styles.label}>
            Cost:{" "}
            <input
              type="number"
              value={cost}
              onChange={(e) =>
                context.dispatch({
                  type: "updateCost",
                  payload: e.target.value,
                })
              }
            />
          </label>
        </section>
        <button style={styles.btnExpense} onClick={addExpenses}>
          +
        </button>
        {/* <label>
          Current timeframe:{" "}
          <select
            id="timeframe"
            style={styles.timeFrame}
            value={timeFrame}
            onChange={(e) => {
              context.dispatch({
                type: "updateTimeFrame",
                payload: e.target.value,
              });
              context.dispatch({
                type: "updateDisplayResults",
                payload: false,
              });
            }}
          >
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="fortnight">fortnight</option>
            <option value="month">month</option>
            <option value="year">year</option>
          </select>
        </label> */}
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
                context.dispatch({
                  type: "updateDisplayResults",
                  payload: false,
                });
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
                category={item.category}
                description={item.description}
                cost={item.cost}
                deleteListItem={deleteListItem}
              />
            );
          })}
        </ul>
      ) : null}

      {displayResults === true && netProfit > 0 ? (
        <div>
          <div>Total Expenses: {totalExpenses}</div>
          <div>
            Your total savings is {Math.round(totalSavings * 100) / 100}
            {/* {timeFrame} */}
          </div>
          <div>
            Net Profit: {Math.round(netProfit * 100) / 100}
            {/* {timeFrame} */}
          </div>
        </div>
      ) : displayResults === true && totalExpenses > 0 ? (
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
  timeFrame: { marginTop: "5%" },
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

export default BudgetView;
