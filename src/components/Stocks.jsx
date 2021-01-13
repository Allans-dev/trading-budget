import React, { useState } from "react";

import StocksListItem from "./StocksListItem";

const Stocks = () => {
  const [stockName, setStockName] = useState("");
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [volume, setvolume] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [yearCheck, setYearCheck] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [stocksList, setStocksList] = useState([]);

  let taxableIncome;
  let taxOwed;
  let netProfit;
  let taxBracket;

  console.log(stocksList);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTotal(true);
  };

  const oneYearCheck = () => {
    yearCheck ? setYearCheck(false) : setYearCheck(true);
  };

  const addStocks = (e) => {
    e.preventDefault();
    setStocksList([
      ...stocksList,
      {
        stockName,
        buyPrice,
        sellPrice,
        volume,
        yearCheck,
        taxableIncome,
        taxOwed,
        netProfit,
      },
    ]);
    setStockName("");
    setBuyPrice(0);
    setSellPrice(0);
    setvolume(0);
    setYearCheck(false);
    document.getElementById("yearCheckBox").checked = false;
    taxableIncome = 0;
    taxOwed = 0;
    netProfit = 0;
  };

  const deleteListItem = (id) => {
    if (stocksList.length > 0) {
      setStocksList(
        stocksList.filter((item, index) => {
          console.log(item.stockName + item.buyPrice * item.sellPrice);
          return index + item.stockName !== id;
        })
      );
    }
  };

  taxableIncome = yearCheck
    ? ((sellPrice - buyPrice) * volume) / 2 + Math.round(Number(annualIncome))
    : (sellPrice - buyPrice) * Number(volume) +
      Math.round(Number(annualIncome));

  if (taxableIncome <= 18200) {
    taxBracket = 0;
  }
  if (taxableIncome > 18201 && taxableIncome <= 45000) {
    taxBracket = 0.19;
  }
  if (taxableIncome > 45001 && taxableIncome <= 120000) {
    taxBracket = 0.325;
  }
  if (taxableIncome > 120001 && taxableIncome <= 180000) {
    taxBracket = 0.37;
  }
  if (taxableIncome > 180001) {
    taxBracket = 0.45;
  }

  switch (taxBracket) {
    case 0:
      taxOwed = 0;
      netProfit = taxableIncome;
      break;
    case 0.19:
      taxOwed = (taxableIncome - 18201) * taxBracket;
      netProfit = taxableIncome - taxOwed;
      break;
    case 0.325:
      taxOwed = 5092 + (taxableIncome - 45000) * taxBracket;
      netProfit = taxableIncome - taxOwed;
      break;
    case 0.37:
      taxOwed = 29467 + (taxableIncome - 120000) * taxBracket;
      netProfit = taxableIncome - taxOwed;
      break;
    case 0.45:
      taxOwed = 51667 + (taxableIncome - 180000) * taxBracket;
      netProfit = taxableIncome - taxOwed;
      break;
    default:
      break;
  }

  return (
    <article style={styles.article}>
      <section style={styles.formSection}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Share Name:
            <input
              type="text"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              required
            />
          </label>
          <label style={styles.label}>
            Unit Price (Bought):
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
              value={volume}
              onChange={(e) => setvolume(e.target.value)}
              required
            />
          </label>
          <label style={styles.left}>
            Held more than 1 year?{" "}
            <input type="checkbox" id="yearCheckBox" onClick={oneYearCheck} />
          </label>

          <button onClick={addStocks}>+</button>

          <label style={styles.label}>
            Annual Income:
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              required
            />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </section>

      {stocksList.length > 0 ? (
        <ul>
          {stocksList.map((item, index) => {
            if (item[0]) {
              return (
                <StocksListItem
                  index={index}
                  stockName={item[0].stockName}
                  buyPrice={item[0].buyPrice}
                  sellPrice={item[0].sellPrice}
                  volume={item[0].volume}
                  yearCheck={item[0].yearCheck}
                  deleteListItem={deleteListItem}
                />
              );
            } else {
              return (
                <StocksListItem
                  index={index}
                  stockName={item.stockName}
                  buyPrice={item.buyPrice}
                  sellPrice={item.sellPrice}
                  volume={item.volume}
                  yearCheck={item.yearCheck}
                  deleteListItem={deleteListItem}
                />
              );
            }
          })}
        </ul>
      ) : null}
      {showTotal ? (
        <div style={styles.profit}>
          <div>
            Taxable Income ={" "}
            {taxableIncome > 0
              ? Math.round((taxableIncome + Number.EPSILON) * 100) / 100
              : 0}
          </div>
          <div>
            Income tax Owed ={" "}
            {taxOwed > 0
              ? Math.round((taxOwed + Number.EPSILON) * 100) / 100
              : 0}
          </div>
          <div>
            Profit = {Math.round((netProfit + Number.EPSILON) * 100) / 100}
          </div>
          <aside style={styles.aside}>
            The above rates do not include the Medicare levy of 2% or any low
            income offsets.
          </aside>
        </div>
      ) : null}
    </article>
  );
};

const styles = {
  article: { textAlign: "center" },
  formSection: {
    display: "flex",
    justifyContent: "center",
  },
  form: {
    backgroundColor: "bisque",
    display: "inline-flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  left: {
    textAlign: "left",
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
  },
  profit: {
    display: "block",
  },
  aside: {
    margin: "10px",
  },
};

export default Stocks;
