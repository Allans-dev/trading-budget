import React, { useContext } from 'react';

import StocksListItem from './StocksListItem';

import { store as stocksStore } from './stocks-store';

import './stocks_styles.css';

const StocksView = ({
  calculateProfit,
  addStocks,
  oneYearCheck,
  deleteListItem,
}) => {
  const stocksContext = useContext(stocksStore);

  const {
    stockName,
    buyPrice,
    sellPrice,
    volume,
    salary,
    showTotal,
    totalIncome,
    taxOwed,
    profitBE,
    iProfit,
    stocksList,
  } = stocksContext.state;

  return (
    <article className='stocks-article'>
      <section className='stocksFormSection'>
        <form>
          <label>
            Share Name:
            <input
              type='text'
              value={stockName}
              onChange={(e) =>
                stocksContext.dispatch({
                  type: 'updateStockName',
                  payload: e.target.value,
                })
              }
              maxLength='6'
              required
            />
          </label>
          <label>
            Buy Price:
            <input
              type='number'
              value={buyPrice}
              onChange={(e) =>
                stocksContext.dispatch({
                  type: 'updateBuyPrice',
                  payload: e.target.value,
                })
              }
              maxLength='5'
              required
            />
          </label>
          <label>
            Sold Price:
            <input
              type='number'
              value={sellPrice}
              onChange={(e) =>
                stocksContext.dispatch({
                  type: 'updateSellPrice',
                  payload: e.target.value,
                })
              }
              maxLength='5'
              required
            />
          </label>
          <label>
            Volume:
            <input
              type='number'
              value={volume}
              onChange={(e) =>
                stocksContext.dispatch({
                  type: 'updateVolume',
                  payload: e.target.value,
                })
              }
              maxLength='5'
              required
            />
          </label>
          <label className='left'>
            Held more than 1 year?{' '}
            <input type='checkbox' id='yearCheckBox' onClick={oneYearCheck} />
          </label>

          <button className='add-shares button' onClick={addStocks}>
            Add Shares
          </button>

          <label>
            Income:
            <input
              type='number'
              value={salary}
              onChange={(e) =>
                stocksContext.dispatch({
                  type: 'updateSalary',
                  payload: e.target.value,
                })
              }
            />
          </label>

          <button className='button green' onClick={calculateProfit}>
            {' '}
            {showTotal ? 'Show Stocks' : 'Save and Calculate'}
          </button>
        </form>
      </section>

      {Array.isArray(stocksList) ? (
        <section className={stocksList.length > 0 ? `result-section` : `none`}>
          {showTotal ? (
            <section className='summary'>
              <span>Total Taxable Income: </span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Math.round(totalIncome * 100) / 100)}
              </span>
              <span>Income tax Owed: </span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Math.round(taxOwed * 100) / 100)}{' '}
              </span>
              <span>Take-Home Income: </span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Math.round(profitBE * 100) / 100)}
              </span>
            </section>
          ) : (
            <section className='stocks-display'>
              <table>
                <tbody>
                  <tr>
                    <th>Code</th>
                    <th>Buy</th>
                    <th>Sell</th>
                    <th>Volume</th>
                    <th>Profit</th>
                    <th> &gt;year</th>
                  </tr>
                  {stocksList.map((item, index) => (
                    <StocksListItem
                      key={index}
                      index={index}
                      stockName={item.stockName}
                      buyPrice={item.buyPrice}
                      sellPrice={item.sellPrice}
                      volume={item.volume}
                      yearCheck={item.yearCheck}
                      deleteListItem={deleteListItem}
                      iProfit={iProfit}
                    />
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </section>
      ) : null}
    </article>
  );
};

export default StocksView;
