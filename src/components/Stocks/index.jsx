import React, { useContext, useEffect, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { store } from './stocks-store';
import { store as mainStore } from '../../main-store';

import StocksView from './StocksView';

const Stocks = () => {
  const mContext = useContext(mainStore);

  const context = useContext(store);

  const {
    profitBE,
    taxOwed,
    taxBracket,
    salary,
    stockName,
    sellPrice,
    buyPrice,
    volume,
    showTotal,
    totalIncome,
    stocksList,
  } = context.state;

  const [yearCheck, setYearCheck] = useState(false);

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;
  const stocksCollectionDoc = db.collection('users').doc(user.uid);

  useEffect(() => {
    mContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    getStocks(stocksCollectionDoc);
    mContext.dispatch({
      type: 'isLoading',
      payload: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStocks = async (stocksCollectionDoc) => {
    await stocksCollectionDoc
      .get()
      .then((doc) => {
        if (doc) {
          context.dispatch({
            type: 'updateStocksList',
            payload: doc.data().stocksList ? doc.data().stocksList : stocksList,
          });
          context.dispatch({
            type: 'updateProfitBE',
            payload: doc.data().profitBE ? doc.data().profitBE : profitBE,
          });
          context.dispatch({
            type: 'updateTotalIncome',
            payload: doc.data().totalIncome
              ? doc.data().totalIncome
              : totalIncome,
          });
          context.dispatch({
            type: 'updateTaxOwed',
            payload: doc.data().taxOwed ? doc.data().taxOwed : taxOwed,
          });
          context.dispatch({
            type: 'updateYearCheck',
            payload: doc.data().yearCheck ? doc.data().yearCheck : yearCheck,
          });
          context.dispatch({
            type: 'updateSalary',
            payload: doc.data().salary ? doc.data().salary : salary,
          });
          context.dispatch({
            type: 'updateTaxBracket',
            payload: doc.data().taxBracket ? doc.data().taxBracket : taxBracket,
          });
        }
      })
      .catch(() => {
        console.log('No such document!');
      });
  };

  useEffect(() => {
    mContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    saveStocks(stocksCollectionDoc);
    mContext.dispatch({
      type: 'isLoading',
      payload: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.state]);

  const saveStocks = async (stocksCollectionDoc) => {
    await stocksCollectionDoc
      .set(
        {
          profitBE,
          taxOwed,
          stocksList,
          salary,
          taxBracket,
          totalIncome,
        },
        { merge: true }
      )
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  };

  const oneYearCheck = () => {
    yearCheck ? setYearCheck(false) : setYearCheck(true);
  };

  const deleteListItem = async (id) => {
    if (stocksList.length > 0) {
      context.dispatch({
        type: 'deleteStock',
        payload: stocksList.filter(
          (item, index) => index + item.stockName !== id
        ),
      });
    }
  };

  const calcTaxBracket = (checkedIncome) => {
    const taxBracket =
      checkedIncome > 180_001
        ? 0.45
        : checkedIncome > 120_001 && checkedIncome < 180_000
        ? 0.37
        : checkedIncome > 45_000 && checkedIncome < 120_000
        ? 0.325
        : checkedIncome > 18_201 && checkedIncome < 45_000
        ? 0.19
        : checkedIncome <= 18_200
        ? 0
        : 0;

    context.dispatch({
      type: 'updateTaxBracket',
      payload: taxBracket,
    });
    return taxBracket;
  };

  const calcTaxOwed = (checkedIncome, taxBracket) => {
    const taxOwed =
      checkedIncome > 180_001 && checkedIncome < 180_000
        ? (checkedIncome - 180_000) * taxBracket + 51_667
        : checkedIncome > 120_000 && checkedIncome < 120_000
        ? (checkedIncome - 120_000) * taxBracket + 29_467
        : checkedIncome > 45_000 && checkedIncome < 45_000
        ? (checkedIncome - 45_000) * taxBracket + 5_092
        : checkedIncome > 18_201
        ? (checkedIncome - 18_201) * taxBracket
        : checkedIncome <= 18_200
        ? 0
        : 0;

    context.dispatch({
      type: 'updateTaxOwed',
      payload: taxOwed,
    });

    return taxOwed;
  };

  const addStocks = (e) => {
    e.preventDefault();

    const calcIProfit =
      yearCheck && Number((sellPrice - buyPrice) * volume) > 0
        ? Number((sellPrice - buyPrice) * volume) / 2
        : Number((sellPrice - buyPrice) * volume);

    const payload =
      Array.isArray(stocksList) && stocksList.length > 0
        ? [
            ...stocksList,
            {
              stockName,
              buyPrice,
              sellPrice,
              volume,
              yearCheck,
              iProfit: calcIProfit,
            },
          ]
        : [
            {
              stockName,
              buyPrice,
              sellPrice,
              volume,
              yearCheck,
              iProfit: calcIProfit,
            },
          ];

    context.dispatch({
      type: 'updateStocksList',
      payload,
    });

    context.dispatch({ type: 'updateStockName', payload: '' });
    context.dispatch({ type: 'updateBuyPrice', payload: 0 });
    context.dispatch({ type: 'updateSellPrice', payload: 0 });
    context.dispatch({ type: 'updateVolume', payload: 0 });
    setYearCheck(false);

    document.getElementById('yearCheckBox').checked = false;

    context.dispatch({ type: 'updateShowTotal', payload: false });
  };

  const calcTotal = () => {
    let profitArray = stocksList.map((item) => {
      return item.iProfit;
    });

    const stockTotal =
      profitArray.length > 0 ? profitArray.reduce((a, b) => a + b) : 0;

    let totalIncome = yearCheck
      ? stockTotal / 2 + Math.round(Number(salary))
      : stockTotal + Math.round(Number(salary));
    context.dispatch({
      type: 'updateTotalIncome',
      payload: totalIncome,
    });

    return totalIncome;
  };

  const combine = () => {
    const checkedIncome = calcTotal();

    const taxBracket = calcTaxBracket(checkedIncome);

    const taxOwed = calcTaxOwed(checkedIncome, taxBracket);

    context.dispatch({
      type: 'updateProfitBE',
      payload: checkedIncome - taxOwed,
    });
  };

  const calculateProfit = (e) => {
    e.preventDefault();
    combine();
    saveStocks();
    context.dispatch({
      type: 'updateShowTotal',
      payload: showTotal ? false : true,
    });
  };

  return (
    <StocksView
      calculateProfit={calculateProfit}
      addStocks={addStocks}
      oneYearCheck={oneYearCheck}
      deleteListItem={deleteListItem}
    />
  );
};

export default Stocks;
