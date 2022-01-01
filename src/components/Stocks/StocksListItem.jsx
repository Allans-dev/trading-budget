import React from "react";

import "./stocks_styles.css";

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
    <li className="list-item" key={id}>
      <div className="stock-detail">
        <div>{stockName}</div>
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format((Math.round(buyPrice) * 100) / 100)}
        </div>
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Math.round(sellPrice * 100) / 100)}
        </div>
        <div>{new Intl.NumberFormat().format(volume)}</div>
        <div>
          {" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(
            Math.round(Number((sellPrice - buyPrice) * volume) * 100) / 100
          )}
        </div>

        <button
          className="button delete"
          onClick={(e) => {
            e.preventDefault();
            deleteListItem(id);
          }}
        >
          X
        </button>
      </div>
      {yearCheck ? <span className="one-year">Held over one year</span> : null}
    </li>
  );
};

export default StocksListItem;
