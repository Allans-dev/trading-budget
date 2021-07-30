import React, { useContext } from "react";

import { store } from "./budget-store";

import ExpenseItem from "./ExpenseItem";

import "./budget-style.css";

const BudgetView = (props) => {
  const context = useContext(store);
  const {
    // timeFrame,
    profitBE,
    category,
    description,
    cost,
    expenseArray,
    savingsRate,
    displayResults,
    otherCategory,
    totalSavings,
    totalExpenses,
    netProfit,
  } = context.state;

  // console.log(timeFrame);

  const { calcBudget, addExpenses, deleteListItem } = props;

  return (
    <article class="budget-page">
      <form onSubmit={addExpenses}>
        <section class="add-expense">
          <label class="category">
            Category:{" "}
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
                required
                class="other"
                type="text"
                value={otherCategory}
                onChange={(e) => {
                  context.dispatch({
                    type: "updateOtherCategory",
                    payload: e.target.value,
                  });
                }}
                maxLength="10"
              />
            )}
          </label>

          <label class="description">
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) =>
                context.dispatch({
                  type: "updateDescription",
                  payload: e.target.value,
                })
              }
              maxLength="10"
            />
          </label>
          <label class="cost">
            Cost:{" "}
            <input
              required
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
          <input type="submit" value="+" />
        </section>

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
          <label class="savings-label">
            <span style={{ display: "block" }}>Savings Rate:</span>
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
            <div class="savings-rate">{savingsRate}%</div>
          </label>
          <button class="green button" onClick={calcBudget}>
            {displayResults ? "Show Expenses" : "Save and Calculate"}
          </button>
        </section>
      </form>

      <section class={expenseArray.length > 0 ? "results" : "none"}>
        {displayResults === true && netProfit > 0 ? (
          <div class="summary">
            <span>Take-Home Income: </span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.round(profitBE * 100) / 100)}
            </span>
            <span>Total Expenses:</span>
            <span>
              {" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.round(totalExpenses * 100) / 100)}
            </span>
            <span>Total Savings: </span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.round(totalSavings * 100) / 100)}
            </span>

            {/* <span>{timeFrame} </span> */}
            <span>Net Profit: </span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.round(netProfit * 100) / 100)}
            </span>
            {/* {timeFrame} */}
          </div>
        ) : displayResults === true && totalExpenses > 0 ? (
          <div class="expenses">
            <div>
              Total Expenses:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.round(totalExpenses * 100) / 100)}
            </div>
          </div>
        ) : Array.isArray(expenseArray) ? (
          <ul>
            {expenseArray.map((item, index) => (
              <ExpenseItem
                key={index}
                index={index}
                category={item.category}
                description={item.description}
                cost={item.cost}
                deleteListItem={deleteListItem}
                otherCategory={otherCategory}
              />
            ))}
          </ul>
        ) : null}
      </section>
    </article>
  );
};

export default BudgetView;
