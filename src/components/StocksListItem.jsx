import React from "react";

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
    <li style={styles.listItem} key={id}>
      <div>{stockName}</div>
      <div>
        <div>Buy Price</div> {buyPrice}
      </div>
      <div>
        <div>Sell Price</div> {sellPrice}
      </div>
      <div>
        <div>Volume</div> {volume}
      </div>
      {yearCheck ? <div>Held over one year</div> : null}
      <button
        onClick={(e) => {
          e.preventDefault();
          deleteListItem(id);
        }}
      >
        -
      </button>
    </li>
  );
};

const styles = {
  listItem: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
};

export default StocksListItem;
