import React, { useEffect, useState } from 'react';
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

import { StateProvider } from './main-store';
import { StockStateProvider } from '../components/Stocks/stocks-store';
import { BudgetStateProvider } from '../components/Budget/budget-store';

import { boolUser } from './firebase-model';

import './App.css';

const App = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleAuthStatus = () => setAuthStatus(() => false);

  useEffect(() => {
    setIsLoading(() => true);
    boolUser ? setAuthStatus(() => true) : setAuthStatus(() => false);
    setIsLoading(() => false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boolUser]);

  const policyMatch = matchPath('/logged-out-privacy-policy', {
    path: window.location.pathname,
  });

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
        <Header toggleAuthStatus={toggleAuthStatus} />

        <Route exact path='/privacy-policy'>
          <PrivacyPolicy />
        </Route>

        <Route exact path='/disclaimer'>
          <Disclaimer />
        </Route>
        <StateProvider>
          <StockStateProvider>
            <BudgetStateProvider>
              <Route exact path='/'>
                <Landing authStatus={authStatus} />
              </Route>
              <Route exact path='/stocks'>
                <Stocks authStatus={authStatus} />
              </Route>
              <Route exact path='/budget'>
                <Budget authStatus={authStatus} />
              </Route>
              <Route exact path='/analysis'>
                <Analysis />
              </Route>
            </BudgetStateProvider>
          </StockStateProvider>
        </StateProvider>

        <Footer />
      </Router>
    </article>
  ) : (
    <Router>
      <article className='root' id='login'>
        <Route path='/'>
          <SignIn policyMatch={policyMatch} />
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