import React, { useState } from "react";

import StocksListItem from "./StocksListItem";

const Stocks = () => {
  const [stockName, setStockName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [volume, setVolume] = useState("");
  const [showTotal, setShowTotal] = useState(false);
  const [yearCheck, setYearCheck] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [stocksList, setStocksList] = useState([]);

  let stockIncome;
  let taxableIncome;
  let taxOwed;
  let netProfit;
  let taxBracket;

  console.log("====================================");

  console.log("stocksList = ");
  console.log(stocksList);

  const calculateProfit = (e) => {
    e.preventDefault();
    showTotal ? setShowTotal(false) : setShowTotal(true);
  };

  const oneYearCheck = () => {
    yearCheck ? setYearCheck(false) : setYearCheck(true);
  };

  const deleteListItem = (id) => {
    if (stocksList.length > 0) {
      setStocksList(
        stocksList.filter((item, index) => {
          return index + item.stockName !== id;
        })
      );
    }
  };

  if (yearCheck) {
    stockIncome = ((sellPrice - buyPrice) * Number(volume)) / 2;
  } else {
    stockIncome = (sellPrice - buyPrice) * Number(volume);
  }

  if (stocksList.length > 0) {
    let stockIncomeArray = stocksList.map((item) => {
      console.log("stockIncome");
      console.log(item.stockIncome);
      return item.stockIncome;
    });
    taxableIncome =
      stockIncomeArray.reduce((a, b) => a + b) +
      Math.round(Number(annualIncome));
    console.log("taxable Income = " + taxableIncome);
  } else {
    taxableIncome = 0;
  }

  if (taxableIncome <= 18200) {
    taxOwed = 0;
  }
  if (taxableIncome > 18200 && taxableIncome < 45001) {
    taxBracket = 0.19;
    taxOwed = (taxableIncome - 18201) * taxBracket;
  }
  if (taxableIncome > 45000 && taxableIncome < 120001) {
    taxBracket = 0.325;
    taxOwed = 5092 + (taxableIncome - 45000) * taxBracket;
  }
  if (taxableIncome > 120000 && taxableIncome <= 180000) {
    taxBracket = 0.37;
    taxOwed = 29467 + (taxableIncome - 120000) * taxBracket;
  }
  if (taxableIncome > 180001) {
    taxBracket = 0.45;
    taxOwed = 51667 + (taxableIncome - 180000) * taxBracket;
  }

  console.log("total taxable Income");
  console.log(taxableIncome);
  console.log("tax owed");
  console.log(taxOwed);

  netProfit = taxableIncome - taxOwed;

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
        stockIncome,
        taxableIncome,
      },
    ]);
    setStockName("");
    setBuyPrice(0);
    setSellPrice(0);
    setVolume(0);
    setYearCheck(false);
    document.getElementById("yearCheckBox").checked = false;
  };

  return (
    <article style={styles.article}>
      <section style={styles.formSection}>
        <form style={styles.form} onSubmit={addStocks}>
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
              onChange={(e) => setVolume(e.target.value)}
              required
            />
          </label>
          <label style={styles.left}>
            Held more than 1 year?{" "}
            <input type="checkbox" id="yearCheckBox" onClick={oneYearCheck} />
          </label>

          <input type="submit" value="+" />

          <label style={styles.label}>
            Annual Income:
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
            />
          </label>

          <button onClick={calculateProfit}>Calculate Profit</button>
        </form>
      </section>

      {stocksList.length > 0 ? (
        <ul style={styles.ul}>
          {stocksList.map((item, index) => {
            return (
              <StocksListItem
                key={index}
                index={index}
                stockName={item.stockName}
                buyPrice={item.buyPrice}
                sellPrice={item.sellPrice}
                volume={item.volume}
                yearCheck={item.yearCheck}
                deleteListItem={deleteListItem}
              />
            );
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
  ul: {
    backgroundColor: "bisque",
    padding: 0,
  },
  profit: {
    display: "block",
  },
  aside: {
    margin: "10px",
  },
};

export default Stocks;
