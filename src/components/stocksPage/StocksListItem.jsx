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
        <div>{buyPrice}</div>
        <div>{sellPrice}</div>
        <div>{volume}</div>

        <button
          class="button delete"
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
