import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, matchPath } from 'react-router-dom';

import Landing from '../components/Landing';
import Stocks from '../components/Stocks';
import Budget from '../components/Budget';
import Analysis from '../components/Analysis';

import Footer from '../components/Footer';
import Header from '../components/Header';

import RingLoader from 'react-spinners/RingLoader';

import SignIn from '../components/SignIn';

import PrivacyPolicy from '../components/PrivacyPolicy';
import Disclaimer from '../components/Disclaimer';

import { store as mainStore } from '../main-store';
import { store as stocksStore } from '../components/Stocks/stocks-store';
import { store as budgetStore } from '../components/Budget/budget-store';

import { readFromDb } from './firebase-model';

import './App.css';

const App = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const signOutAuth = () => setAuthStatus(() => false);
  const signInAuth = () => setAuthStatus(() => true);

  const mainContext = useContext(mainStore);
  const stocksContext = useContext(stocksStore);
  const budgetContext = useContext(budgetStore);

  const { isLoading } = mainContext.state;

  const policyMatch = matchPath('/logged-out-privacy-policy', {
    path: window.location.pathname,
  });

  const accessReadFromDb = async () => {
    mainContext.dispatch({
      type: 'isLoading',
      payload: true,
    });
    try {
      const dbState = await readFromDb();

      if (dbState.stocksList) {
        stocksContext.dispatch({
          type: 'updateStocksList',
          payload: dbState.stocksList,
        });
        stocksContext.dispatch({
          type: 'updateProfitBE',
          payload: dbState.profitBE,
        });
        stocksContext.dispatch({
          type: 'updateTotalIncome',
          payload: dbState.totalIncome,
        });
        stocksContext.dispatch({
          type: 'updateTaxOwed',
          payload: dbState.taxOwed,
        });
        stocksContext.dispatch({
          type: 'updateSalary',
          payload: dbState.salary || 0,
        });
        stocksContext.dispatch({
          type: 'updateTaxBracket',
          payload: dbState.taxBracket,
        });
      }

      if (dbState.expenseArray) {
        budgetContext.dispatch({
          type: 'updateExpenses',
          payload: dbState.expenseArray,
        });
        budgetContext.dispatch({
          type: 'updateTotalSavings',
          payload: dbState.totalSavings,
        });
        budgetContext.dispatch({
          type: 'updateNetProfit',
          payload: dbState.netProfit,
        });
        budgetContext.dispatch({
          type: 'updateTotalExpenses',
          payload: dbState.totalExpenses,
        });
      }
    } catch {
      console.log('error db read');
    }

    mainContext.dispatch({
      type: 'isLoading',
      payload: false,
    });
  };

  if (isLoading) {
    return (
      <article className='loader-background'>
        <RingLoader color={'#4e4e4e'} loading={isLoading} size={100} />
      </article>
    );
  }

  return authStatus ? (
    <article className='root'>
      <Router>
        <Header signOutAuth={signOutAuth} />

        <Route exact path='/privacy-policy'>
          <PrivacyPolicy />
        </Route>

        <Route exact path='/disclaimer'>
          <Disclaimer />
        </Route>

        <Route exact path='/'>
          <Landing />
        </Route>
        <Route exact path='/stocks'>
          <Stocks />
        </Route>
        <Route exact path='/budget'>
          <Budget />
        </Route>
        <Route exact path='/analysis'>
          <Analysis />
        </Route>

        <Footer />
      </Router>
    </article>
  ) : (
    <Router>
      <article className='root' id='login'>
        <Route path='/'>
          <SignIn
            policyMatch={policyMatch}
            signInAuth={signInAuth}
            accessReadFromDb={accessReadFromDb}
          />
        </Route>

        <Route exact path='/logged-out-privacy-policy'>
          <PrivacyPolicy />
        </Route>

        <Route exact path='/logged-out-disclaimer'>
          <Disclaimer />
        </Route>
      </article>
    </Router>
  );
};

export default App;
