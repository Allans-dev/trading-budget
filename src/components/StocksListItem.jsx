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
      <div style={styles.stockDetail}>
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

        <button
          onClick={(e) => {
            e.preventDefault();
            deleteListItem(id);
          }}
        >
          -
        </button>
      </div>
      {yearCheck ? <div style={styles.oneYear}>Held over one year</div> : null}
    </li>
  );
};

const styles = {
  stockDetail: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "no-wrap",
    justifyContent: "space-between",
  },
  oneYear: {
    flex: "0 0 100%",
  },
};

export default StocksListItem;
