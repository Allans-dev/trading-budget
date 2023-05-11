import React, { useContext } from 'react';

import { store as mainStore } from '../../main-store';
import { store as budgetStore } from './budget-store';
import { store as stocksStore } from '../Stocks/stocks-store';

import { writeToDb } from '../../App/firebase-model';

import BudgetView from './BudgetView';

const Budget = () => {
  const mainContext = useContext(mainStore);
  const budgetContext = useContext(budgetStore);
  const stocksContext = useContext(stocksStore);
  const {
    expenseArray,
    savingsRate,
    category,
    description,
    cost,
    displayResults,
    otherCategory,
  } = budgetContext.state;

  const { profitBE } = stocksContext.state;

  const addExpenses = (e) => {
    e.preventDefault();

    let payload;
    if (Array.isArray(expenseArray)) {
      payload = [
        ...expenseArray,
        {
          category: category !== 'Other' ? category : otherCategory,
          description,
          cost,
        },
      ];
      payload = payload.sort((a, b) => {
        var nameA = a.category.toUpperCase();
        var nameB = b.category.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    } else {
      payload = [
        {
          category: category !== 'Other' ? category : otherCategory,
          description,
          cost,
        },
      ];
      payload = payload.sort((a, b) => {
        var nameA = a.category.toUpperCase();
        var nameB = b.category.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }

    budgetContext.dispatch({
      type: 'updateExpenses',
      payload,
    });

    mainContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    writeToDb({ expenseArray: payload });
    mainContext.dispatch({
      type: 'isLoading',
      payload: false,
    });

    budgetContext.dispatch({ type: 'updateDescription', payload: '' });
    budgetContext.dispatch({ type: 'updateOtherCategory', payload: '' });
    budgetContext.dispatch({ type: 'updateCost', payload: '' });
  };

  const deleteListItem = (id) => {
    let payload = expenseArray.filter(
      (item, index) => index + item.description !== id
    );

    if (expenseArray.length > 0) {
      budgetContext.dispatch({
        type: 'deleteExpense',
        payload,
      });
    }
    mainContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    writeToDb({ expenseArray: payload });
    mainContext.dispatch({
      type: 'isLoading',
      payload: false,
    });
  };

  const calcTotalExpenses = () => {
    const totalExpenses =
      expenseArray && expenseArray.length > 0
        ? expenseArray.map((item) => Number(item.cost)).reduce((a, b) => a + b)
        : 0;

    budgetContext.dispatch({
      type: 'updateTotalExpenses',
      payload: totalExpenses,
    });

    return totalExpenses;
  };

  const calcTotalSavings = (totalE) => {
    const totalSavings = ((profitBE - totalE) * savingsRate) / 100;

    budgetContext.dispatch({
      type: 'updateTotalSavings',
      payload: totalSavings,
    });

    return totalSavings;
  };

  const calcNetProfits = (totalE, totalS) => {
    const netProfit = profitBE - totalE - totalS;
    budgetContext.dispatch({
      type: 'updateNetProfit',
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

    budgetContext.dispatch({
      type: 'updateDisplayResults',
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

export default Budget;
