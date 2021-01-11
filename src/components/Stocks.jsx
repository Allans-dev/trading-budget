import React, { useState } from "react";

const Stocks = () => {
  const [shareName, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [numberOfShares, setNumberOfShares] = useState(0);
  const [showTotal, setShowTotal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTotal(true);
  };

  return (
    <article style={styles.article}>
      <form style={styles.stocksForm} onSubmit={handleSubmit}>
        <label style={styles.label}>
          <span>Share Name:</span>
          <input
            type="text"
            value={shareName}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label style={styles.label}>
          <span>Unit Price (Bought):</span>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            required
          />
        </label>
        <label style={styles.label}>
          Unit Price (Sold):
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            required
          />
        </label>
        <label style={styles.label}>
          Number of Shares:
          <input
            type="number"
            value={numberOfShares}
            onChange={(e) => setNumberOfShares(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Submit" />
      </form>

      {showTotal ? (
        <span>Profit = {(sellPrice - buyPrice) * numberOfShares} </span>
      ) : null}
    </article>
  );
};

const styles = {
  article: {
    display: "flex",
    justifyContent: "center",
  },
  stocksForm: {
    backgroundColor: "bisque",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
  },
};

export default Stocks;
