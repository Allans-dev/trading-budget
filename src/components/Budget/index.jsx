import React, { useContext } from 'react';

import { store as mainStore } from '../../main-store';
import { store } from './budget-store';

import { writeToDb } from '../../App/firebase-model';

import BudgetView from './BudgetView';

const Budget = () => {
  const mainContext = useContext(mainStore);

  const context = useContext(store);
  const {
    expenseArray,
    profitBE,
    savingsRate,
    category,
    description,
    cost,
    displayResults,
    otherCategory,
  } = context.state;

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
    } else {
      payload = [
        {
          category: category !== 'Other' ? category : otherCategory,
          description,
          cost,
        },
      ];
    }

    context.dispatch({
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

    context.dispatch({ type: 'updateDescription', payload: '' });
    context.dispatch({ type: 'updateOtherCategory', payload: '' });
    context.dispatch({ type: 'updateCost', payload: '' });
  };

  const deleteListItem = (id) => {
    let payload = expenseArray.filter(
      (item, index) => index + item.description !== id
    );

    if (expenseArray.length > 0) {
      context.dispatch({
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

    context.dispatch({
      type: 'updateTotalExpenses',
      payload: totalExpenses,
    });
    writeToDb(totalExpenses);

    return totalExpenses;
  };

  const calcTotalSavings = (totalE) => {
    const totalSavings = ((profitBE - totalE) * savingsRate) / 100;

    context.dispatch({
      type: 'updateTotalSavings',
      payload: totalSavings,
    });

    writeToDb(totalSavings);

    return totalSavings;
  };

  const calcNetProfits = (totalE, totalS) => {
    const netProfit = profitBE - totalE - totalS;
    context.dispatch({
      type: 'updateNetProfit',
      payload: netProfit,
    });
    writeToDb(netProfit);
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
