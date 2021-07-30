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
  let id = index + stockName;
  return (
    <li class="list-item" key={id}>
      <div class="stock-detail">
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
          class="button delete"
          onClick={(e) => {
            e.preventDefault();
            deleteListItem(id);
          }}
        >
          X
        </button>
      </div>
      {yearCheck ? <span class="one-year">Held over one year</span> : null}
    </li>
  );
};

export default StocksListItem;
