import React from 'react';

import Stocks from '../Stocks/Stocks';
import Budget from '../Budget/Budget';
import Analysis from '../Analysis/Analysis';

import './landing_styles.css';

const Landing = () =>
  window.matchMedia('(max-width: 1200px)').matches ? (
    <article className='landing'>
      <section style={{ display: 'flex', justifyContent: 'center' }}>
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
export default Landing;
