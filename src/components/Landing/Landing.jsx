import React, { useContext } from 'react';

import { store as mainStore } from '../../main-store';

import Stocks from '../Stocks/Stocks';
import Budget from '../Budget/Budget';
import Analysis from '../Analysis/Analysis';

import { RingLoader } from 'react-spinners';

import './landing_styles.css';

const Landing = () => {
  const mContext = useContext(mainStore);
  const { isLoading } = mContext.state;

  if (isLoading) {
    return (
      <article className='loading-component'>
        <RingLoader color={'#4e4e4e'} loading={isLoading} size={100} />
      </article>
    );
  }

  return window.matchMedia('(max-width: 1200px)').matches ? (
    <article className='landing'>
      {console.log('landing')}
      <section className='intro'>
        <div>
          <h1 style={{ width: '100%', textAlign: 'center' }}>Trading Budget</h1>
          <p>
            Trading Budget is my finance app that records stock data from inputs
            and saves to firebase database.{' '}
          </p>
          <p>
            Please click "save and calculate" to persist to database and
            calculate values between tabs.{' '}
          </p>
          <div style={{ textAlign: 'center' }}>
            <span>
              <strong>Hello World! and Happy Trading :)</strong>
            </span>
          </div>
        </div>
      </section>
    </article>
  ) : (
    <article className='landing'>
      <Stocks />
      <Budget />
      <Analysis />
    </article>
  );
};
export default Landing;
