import React from 'react';

import './stocks_styles.css';

const StocksListItem = ({
  index,
  stockName,
  buyPrice,
  sellPrice,
  volume,
  yearCheck,
  deleteListItem,
  iProfit,
}) => {
  const id = index + stockName;
  return (
    <tr>
      <td>{stockName}</td>
      <td>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(Math.round(buyPrice * 100) / 100)}
      </td>
      <td>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(Math.round(sellPrice * 100) / 100)}
      </td>
      <td>{new Intl.NumberFormat().format(volume)}</td>
      <td>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(
          Math.round(Number((sellPrice - buyPrice) * volume) * 100) / 100
        )}
      </td>
      <td>{yearCheck ? '✓' : '⛌'}</td>
      <td>
        <button
          className='button delete'
          onClick={(e) => {
            e.preventDefault();
            deleteListItem(id);
          }}
        >
          X
        </button>
      </td>
    </tr>
  );
};

export default StocksListItem;
