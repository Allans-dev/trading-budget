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
}) => {
  let id = index + stockName;
  return (
    <li class="list-item" key={id}>
      <div class="stock-detail">
        <div>{stockName}</div>
        <div>
          <span>Buy Price</span> {buyPrice}
        </div>
        <div>
          <span>Sell Price</span> {sellPrice}
        </div>
        <div>
          <span>Volume</span> {volume}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            deleteListItem(id);
          }}
        >
          -
        </button>
      </div>
      {yearCheck ? <div class="one-year">Held over one year</div> : null}
    </li>
  );
};

export default StocksListItem;
