import React, { useContext, useEffect, useState } from 'react';

import { store } from './stocks-store';
import { store as mainStore } from '../../App/main-store';

import { readFromDb, writeToDb } from '../../App/firebase-model';

import StocksView from './StocksView';

const Stocks = () => {
  const mContext = useContext(mainStore);

  const context = useContext(store);

  const {
    salary,
    stockName,
    sellPrice,
    buyPrice,
    volume,
    showTotal,
    stocksList,
  } = context.state;

  const { initialize } = mContext.state;

  const [yearCheck, setYearCheck] = useState(false);

  const accessReadFromDb = async () => {
    try {
      const dbState = await readFromDb();

      if (dbState.stocksList) {
        context.dispatch({
          type: 'updateStocksList',
          payload: dbState.stocksList,
        });
        context.dispatch({
          type: 'updateProfitBE',
          payload: dbState.profitBE,
        });
        context.dispatch({
          type: 'updateTotalIncome',
          payload: dbState.totalIncome,
        });
        context.dispatch({
          type: 'updateTaxOwed',
          payload: dbState.taxOwed,
        });
        context.dispatch({
          type: 'updateYearCheck',
          payload: dbState.yearCheck,
        });
        context.dispatch({
          type: 'updateSalary',
          payload: dbState.salary,
        });
        context.dispatch({
          type: 'updateTaxBracket',
          payload: dbState.taxBracket,
        });
      }
    } catch {
      console.log('error db read');
    }
  };

  useEffect(() => {
    accessReadFromDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialize) {
      mContext.dispatch({
        type: 'toggleFirstRender',
      });
      console.log('initial render');
    } else {
      mContext.dispatch({
        type: 'isLoading',
        payload: true,
      });
      writeToDb(context.state);
      mContext.dispatch({
        type: 'isLoading',
        payload: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.state]);

  const oneYearCheck = () => {
    yearCheck ? setYearCheck(false) : setYearCheck(true);
  };

  const deleteListItem = (id) => {
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
    writeToDb(context.state);
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
