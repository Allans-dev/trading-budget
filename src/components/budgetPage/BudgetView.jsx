import React, { useContext } from "react";

import { store } from "./budget-store";

import ExpenseItem from "./ExpenseItem";

import "./budget-style.css";

const BudgetView = (props) => {
  const context = useContext(store);
  const {
    // timeFrame,
    category,
    description,
    cost,
    expenseArray,
    savingsRate,
    displayResults,
    totalSavings,
    totalExpenses,
    netProfit,
  } = context.state;

  // console.log(timeFrame);

  const { calcBudget, addExpenses, deleteListItem } = props;

  return (
    <article class="budget-page">
      <form onSubmit={calcBudget}>
        <section>
          <label>
            Description:{" "}
            <select
              required
              id="category"
              class="category"
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
                class="other"
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
          <label>
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
        <button onClick={addExpenses}>+</button>
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
        <section class="savings">
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

        <input type="submit" value="Save and Calculate" />
      </form>
      <section class="results">
        {displayResults === true && netProfit > 0 ? (
          <div>
            <div>Total Expenses: {Math.round(totalExpenses * 100) / 100}</div>
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
          <div class="expenses">
            <div>Total Expenses: {totalExpenses}</div>
          </div>
        ) : Array.isArray(expenseArray) ? (
          <ul>
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
      </section>
    </article>
  );
};

export default BudgetView;
