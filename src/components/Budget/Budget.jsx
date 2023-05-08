import React, { useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { store as mainStore } from '../../main-store';
import { store } from './budget-store';

import BudgetView from './BudgetView';

const Budget = () => {
  const mContext = useContext(mainStore);

  const context = useContext(store);
  const {
    expenseArray,
    profitBE,
    savingsRate,
    totalExpenses,
    totalSavings,
    netProfit,
    category,
    description,
    cost,
    displayResults,
    otherCategory,
  } = context.state;

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;
  const budgetCollectionDoc = db.collection('users').doc(user.uid);

  useEffect(() => {
    mContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    getBudget(budgetCollectionDoc);
    mContext.dispatch({
      type: 'isLoading',
      payload: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  const getBudget = async (budgetCollectionDoc) => {
    if (user.uid) {
      await budgetCollectionDoc
        .get()
        .then((doc) => {
          context.dispatch({
            type: 'updateProfitBE',
            payload: doc.data().profitBE ? doc.data().profitBE : profitBE,
          });
          context.dispatch({
            type: 'updateExpenses',
            payload: doc.data().expenseArray
              ? doc.data().expenseArray
              : expenseArray,
          });
          context.dispatch({
            type: 'updateTotalSavings',
            payload: doc.data().totalSavings
              ? doc.data().totalSavings
              : totalSavings,
          });
          context.dispatch({
            type: 'updateNetProfit',
            payload: doc.data().netProfit ? doc.data().netProfit : netProfit,
          });
          context.dispatch({
            type: 'updateTotalExpenses',
            payload: doc.data().totalExpenses
              ? doc.data().totalExpenses
              : totalExpenses,
          });
        })
        .catch((error) => {
          console.log('no doc');
        });
    }
  };

  useEffect(() => {
    mContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    saveBudget(budgetCollectionDoc);
    mContext.dispatch({
      type: 'isLoading',
      payload: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.state]);

  const saveBudget = async (budgetCollectionDoc) => {
    await budgetCollectionDoc
      .set(
        {
          expenseArray,
          totalExpenses,
          totalSavings,
          netProfit,
        },
        { merge: true }
      )
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  };

  const addExpenses = (e) => {
    e.preventDefault();
    context.dispatch({
      type: 'updateExpenses',
      payload: Array.isArray(expenseArray)
        ? [
            ...expenseArray,
            {
              category: category !== 'Other' ? category : otherCategory,
              description,
              cost,
            },
          ]
        : [
            {
              category: category !== 'Other' ? category : otherCategory,
              description,
              cost,
            },
          ],
    });
    context.dispatch({ type: 'updateDescription', payload: '' });
    context.dispatch({ type: 'updateOtherCategory', payload: '' });
    context.dispatch({ type: 'updateCost', payload: '' });
  };

  const deleteListItem = (index) => {
    if (expenseArray.length > 0) {
      context.dispatch({
        type: 'deleteExpense',
        payload: index,
      });
    }
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

    return totalExpenses;
  };

  const calcTotalSavings = (totalE) => {
    const totalSavings = ((profitBE - totalE) * savingsRate) / 100;

    context.dispatch({
      type: 'updateTotalSavings',
      payload: totalSavings,
    });
    return totalSavings;
  };

  const calcNetProfits = (totalE, totalS) => {
    const netProfit = profitBE - totalE - totalS;
    context.dispatch({
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
