import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { StateProvider } from './main-store';
import { StockStateProvider } from './components/Stocks/stocks-store';
import { BudgetStateProvider } from './components/Budget/budget-store';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <StateProvider>
      <StockStateProvider>
        <BudgetStateProvider>
          <App />
        </BudgetStateProvider>
      </StockStateProvider>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
