import React, { useContext } from 'react';

import { store as budgetStore } from './budget-store';
import { store as stocksStore } from '../Stocks/stocks-store';

import ExpenseItem from './ExpenseItem';

import './budget_style.css';

import 'firebase/firestore';

const BudgetView = (props) => {
  const budgetContext = useContext(budgetStore);
  const stocksContext = useContext(stocksStore);

  const {
    category,
    description,
    cost,
    savingsRate,
    displayResults,
    otherCategory,
    totalSavings,
    totalExpenses,
    netProfit,
    expenseArray,
  } = budgetContext.state;
  const { profitBE } = stocksContext.state;

  const { calcBudget, addExpenses, deleteListItem } = props;

  return (
    <article className='budget-page'>
      <form>
        <section className='add-expense'>
          <label className='category'>
            Category:{' '}
            <select
              required
              id='category'
              className='category'
              value={category}
              onChange={(e) => {
                budgetContext.dispatch({
                  type: 'updateCategory',
                  payload: e.target.value,
                });
              }}
            >
              <option value='Restaurant'>Restaurant</option>
              <option value='Groceries'>Groceries</option>
              <option value='Entertainment'>Entertainment</option>
              <option value='Shopping'>Shopping</option>
              <option value='Rent/Mortgage'>Rent/Mortgage</option>
              <option value='Hobby'>Hobby</option>
              <option value='Household'>Household</option>
              <option value='Transport'>Transport</option>
              <option value='Education'>Education</option>
              <option value='Health'>Health</option>
              <option value='Other'>Other</option>
            </select>
            {category !== 'Other' ? null : (
              <input
                required
                className='other'
                type='text'
                value={otherCategory}
                onChange={(e) => {
                  budgetContext.dispatch({
                    type: 'updateOtherCategory',
                    payload: e.target.value,
                  });
                }}
                maxLength='11'
              />
            )}
          </label>

          <label className='description'>
            Description:
            <input
              type='text'
              value={description}
              onChange={(e) =>
                budgetContext.dispatch({
                  type: 'updateDescription',
                  payload: e.target.value,
                })
              }
              maxLength='11'
            />
          </label>
          <label className='cost'>
            Cost:{' '}
            <input
              required
              type='number'
              value={cost}
              onChange={(e) =>
                budgetContext.dispatch({
                  type: 'updateCost',
                  payload: Number(e.target.value),
                })
              }
            />
          </label>
          <button className='add-button' onClick={addExpenses}>
            +
          </button>
        </section>

        {/* <label>
          Current timeframe:{" "}
          <select
            id="timeframe"
            style={styles.timeFrame}
            value={timeFrame}
            onChange={(e) => {
              budgetContext.dispatch({
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
        <section className='savings'>
          <label className='savings-label'>
            <span style={{ display: 'block' }}>Savings Rate:</span>
            <input
              id='savings-rate'
              type='range'
              min={0}
              max={100}
              value={savingsRate}
              onChange={(e) => {
                budgetContext.dispatch({
                  type: 'updateSavingsRate',
                  payload: e.target.value,
                });
                budgetContext.dispatch({
                  type: 'updateDisplayResults',
                  payload: false,
                });
              }}
            ></input>
            <div className='savings-rate'>{savingsRate}%</div>
          </label>
          <button className='green button' onClick={calcBudget}>
            {displayResults ? 'Show Expenses' : 'Save and Calculate'}
          </button>
        </section>
      </form>

      <section
        className={expenseArray && expenseArray.length > 0 ? 'results' : 'none'}
      >
        {displayResults === true && netProfit > 0 ? (
          <div className='summary'>
            <span>Take-Home Income: </span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Math.round(profitBE * 100) / 100)}
            </span>
            <span>Total Expenses:</span>
            <span>
              {' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Math.round(totalExpenses * 100) / 100)}
            </span>
            <span>Total Savings: </span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Math.round(totalSavings * 100) / 100)}
            </span>

            {/* <span>{timeFrame} </span> */}
            <span>Net Profit: </span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Math.round(netProfit * 100) / 100)}
            </span>
            {/* {timeFrame} */}
          </div>
        ) : displayResults === true && totalExpenses > 0 ? (
          <div className='expenses'>
            <div>
              Total Expenses:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Math.round(totalExpenses * 100) / 100)}
            </div>
          </div>
        ) : Array.isArray(expenseArray) ? (
          <table className='expense-table'>
            <tbody>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Cost</th>
              </tr>
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
            </tbody>
          </table>
        ) : null}
      </section>
    </article>
  );
};

export default BudgetView;
