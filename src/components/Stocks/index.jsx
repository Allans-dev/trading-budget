import React, { useContext, useState } from 'react';

import { store as stocksStore } from './stocks-store';
import { store as mainStore } from '../../main-store';

import { writeToDb } from '../../App/firebase-model';

import StocksView from './StocksView';

const Stocks = () => {
  const mainContext = useContext(mainStore);

  const stocksContext = useContext(stocksStore);

  const {
    salary,
    stockName,
    sellPrice,
    buyPrice,
    volume,
    showTotal,
    stocksList,
  } = stocksContext.state;

  const [yearCheck, setYearCheck] = useState(false);

  const oneYearCheck = () => {
    yearCheck ? setYearCheck(false) : setYearCheck(true);
  };

  const deleteListItem = (id) => {
    if (stocksList.length > 0) {
      stocksContext.dispatch({
        type: 'deleteStock',
        payload: stocksList.filter(
          (item, index) => index + item.stockName !== id
        ),
      });
      mainContext.dispatch({
        type: 'isLoading',
        payload: true,
      });
      writeToDb({ stocksList });
      mainContext.dispatch({
        type: 'isLoading',
        payload: false,
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

    stocksContext.dispatch({
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

    stocksContext.dispatch({
      type: 'updateTaxOwed',
      payload: taxOwed,
    });

    return taxOwed;
  };

  const addStocks = (e) => {
    e.preventDefault();
    mainContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    const calcIProfit =
      yearCheck && Number((sellPrice - buyPrice) * volume) > 0
        ? Number((sellPrice - buyPrice) * volume) / 2
        : Number((sellPrice - buyPrice) * volume);

    let payload;

    if (Array.isArray(stocksList) && stocksList.length > 0) {
      payload = [
        ...stocksList,
        {
          stockName,
          buyPrice,
          sellPrice,
          volume,
          yearCheck,
          iProfit: calcIProfit,
        },
      ];
    } else {
      payload = [
        {
          stockName,
          buyPrice,
          sellPrice,
          volume,
          yearCheck,
          iProfit: calcIProfit,
        },
      ];
    }

    stocksContext.dispatch({
      type: 'updateStocksList',
      payload,
    });

    writeToDb({ stocksList: payload });

    stocksContext.dispatch({ type: 'updateStockName', payload: '' });
    stocksContext.dispatch({ type: 'updateBuyPrice', payload: 0 });
    stocksContext.dispatch({ type: 'updateSellPrice', payload: 0 });
    stocksContext.dispatch({ type: 'updateVolume', payload: 0 });
    setYearCheck(false);

    document.getElementById('yearCheckBox').checked = false;

    stocksContext.dispatch({ type: 'updateShowTotal', payload: false });

    mainContext.dispatch({
      type: 'isLoading',
      payload: false,
    });
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
    stocksContext.dispatch({
      type: 'updateTotalIncome',
      payload: totalIncome,
    });
    return totalIncome;
  };

  const combine = () => {
    const checkedIncome = calcTotal();
    const taxBracket = calcTaxBracket(checkedIncome);
    const taxOwed = calcTaxOwed(checkedIncome, taxBracket);
    const profitBE = checkedIncome - taxOwed;

    stocksContext.dispatch({
      type: 'updateProfitBE',
      payload: profitBE,
    });

    writeToDb({ profitBE });
  };

  const calculateProfit = (e) => {
    e.preventDefault();
    combine();

    stocksContext.dispatch({
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
