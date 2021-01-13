import React from "react";

const StocksListItem = ({
  stockName,
  buyPrice,
  sellPrice,
  volume,
  yearCheck,
}) => {
  return (
    <li style={styles.listItem}>
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
