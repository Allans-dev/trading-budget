import React, { useContext, useEffect } from 'react';

import AnalysisView from './AnalysisView';

import { store as mainStore } from '../../main-store';
import { store as stockStore } from '../Stocks/stocks-store';
import { store as budgetStore } from '../Budget/budget-store';

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

const Analysis = () => {
  // const db = firebase.firestore();
  // const user = firebase.auth().currentUser;
  // const analysisCollectionDoc = db.collection('users').doc(user.uid);

  const sContext = useContext(stockStore);
  const bContext = useContext(budgetStore);
  const mContext = useContext(mainStore);

  const { stocksList } = sContext.state;
  const { expenseArray } = bContext.state;

  // useEffect(() => {
  //   mContext.dispatch({
  //     type: 'isLoading',
  //     payload: true,
  //   });
  //   getAnalysisData(analysisCollectionDoc);
  //   mContext.dispatch({
  //     type: 'isLoading',
  //     payload: false,
  //   });
  //   // eslint-disable-next-line
  // }, [stocksList, expenseArray]);

  // const getAnalysisData = async (analysisCollectionDoc) => {
  //   await analysisCollectionDoc.get().catch(() => {
  //     console.log('No such document!');
  //   });
  // };

  const sortedCost = expenseArray.sort((a, b) => {
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

  const categoryArray = sortedCost
    .map((val, index) => {
      const prev = index - 1 >= 0 ? index - 1 : 0;

      return val.category !== sortedCost[prev].category || index === 0
        ? val.category
        : null;
    })
    .filter((val, index) => {
      return val !== null;
    });

  const extractKeyValues = (keyList, masterList, keyNameOne, keyNameTwo) => {
    const array = [];
    keyList.forEach((val) => {
      masterList.forEach((val2) => {
        let temp = {};
        if (val === val2[keyNameOne]) {
          temp[val2[keyNameOne]] = val2[keyNameTwo];
          array.push(temp);
        }
        temp = {};
      });
    });
    return array;
  };

  const budgetKeyValues = extractKeyValues(
    categoryArray,
    sortedCost,
    'category',
    'cost'
  );

  const addValuesIntoObject = (arr) => {
    let obj = {};
    arr.forEach((list) => {
      for (let [key, value] of Object.entries(list)) {
        if (obj[key]) {
          obj[key] += value;
        } else obj[key] = value;
      }
    });
    return obj;
  };

  const totalExpenseByCategory = addValuesIntoObject(budgetKeyValues);

  const keyLabelToCoords = (obj) => {
    const arr = [];
    for (const key in obj) {
      arr.push({ x: key, y: obj[key] });
    }
    return arr;
  };

  const keyValueToCoords = (obj) => {
    const arr = [];
    for (const key in obj) {
      arr.push({ x: obj[key], y: obj[key] });
    }
    return arr;
  };

  //===============================================================

  const budgetOuter = keyLabelToCoords(totalExpenseByCategory);

  const budgetInner = keyValueToCoords(totalExpenseByCategory);

  //===============================================================

  const sortedStocks = stocksList.sort((a, b) => {
    return b.iProfit - a.iProfit;
  });

  const StockNameArray = stocksList
    .map((val, index) => {
      const prev = index - 1 >= 0 ? index - 1 : 0;

      return val.stockName !== stocksList[prev].stockName || index === 0
        ? val.stockName
        : null;
    })
    .filter((val) => {
      return val !== null;
    });

  const stocksKeyValues = extractKeyValues(
    StockNameArray,
    stocksList,
    'stockName',
    'iProfit'
  );

  const addSelectedValuesIntoObject = (arr) => {
    let obj = { profit: 0, loss: 0 };
    arr.forEach((list) => {
      // eslint-disable-next-line
      for (let [key, value] of Object.entries(list)) {
        if (value >= 0) {
          obj.profit += value;
        } else if (value < 0) {
          obj.loss += value;
        }
      }
    });

    obj.loss *= -1;

    if (obj.loss && obj.profit) {
      return obj;
    } else if (obj.loss && !obj.profit) {
      obj = {};
      obj.loss = 1;
      return obj;
    } else if (obj.profit && !obj.loss) {
      obj = {};
      obj.profit = 1;
      return obj;
    } else {
      return {};
    }
  };

  const nameProfitObject = addSelectedValuesIntoObject(stocksKeyValues);

  //===============================================================

  const stocksInner = keyLabelToCoords(nameProfitObject);

  const stocksOuter =
    sortedStocks.length > 0
      ? sortedStocks.map((val, index) => {
          return {
            x: val.stockName,
            y: val.iProfit >= 0 ? val.iProfit : val.iProfit * -1,
            profit: val.iProfit >= 0 ? true : false,
          };
        })
      : [];

  //===============================================================

  return stocksList.length < 1 && expenseArray.length < 1 ? (
    <div
      style={{
        backgroundColor: 'rgba(26, 26, 26, 0.5)',
        width: '300px',
        height: '55px',
        margin: '0 auto',
        color: '#d6d6d6',
        textAlign: 'center',
        padding: '15px',
        borderRadius: '15px',
        alignSelf: 'center',
      }}
    >
      Please enter a stock or an expense to see it charted.
    </div>
  ) : (
    <AnalysisView
      stocksOuter={stocksOuter}
      stocksInner={stocksInner}
      budgetOuter={budgetOuter}
      budgetInner={budgetInner}
    />
  );
};

export default Analysis;
