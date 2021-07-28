import React, { useContext } from "react";

import StocksListItem from "./StocksListItem";

import { store } from "./stocks-store";

import "./stocks_styles.css";

const StocksView = (props) => {
  const context = useContext(store);

  const { calculateProfit, addStocks, oneYearCheck, deleteListItem } = props;

  const {
    stockName,
    buyPrice,
    sellPrice,
    volume,
    salary,
    stocksList,
    showTotal,
    totalIncome,
    taxOwed,
    profitBE,
    iProfit,
  } = context.state;

  return (
    <article class="article">
      <section class="stocksFormSection">
        <form onSubmit={addStocks}>
          <label>
            Share Name:
            <input
              type="text"
              value={stockName}
              onChange={(e) =>
                context.dispatch({
                  type: "updateStockName",
                  payload: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            Buy Price:
            <input
              type="number"
              value={buyPrice}
              onChange={(e) =>
                context.dispatch({
                  type: "updateBuyPrice",
                  payload: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            Sold Price:
            <input
              type="number"
              value={sellPrice}
              onChange={(e) =>
                context.dispatch({
                  type: "updateSellPrice",
                  payload: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            Volume:
            <input
              type="number"
              value={volume}
              onChange={(e) =>
                context.dispatch({
                  type: "updateVolume",
                  payload: e.target.value,
                })
              }
              required
            />
          </label>
          <label class="left">
            Held more than 1 year?{" "}
            <input type="checkbox" id="yearCheckBox" onClick={oneYearCheck} />
          </label>

          <input type="submit" value="Add Shares" />

          <label>
            Other Income:
            <input
              type="number"
              value={salary}
              onChange={(e) =>
                context.dispatch({
                  type: "updateSalary",
                  payload: Number(e.target.value),
                })
              }
            />
          </label>

          <button class="button green" onClick={calculateProfit}>
            {" "}
            {showTotal ? "Show Stocks" : "Save and Calculate"}
          </button>
        </form>
      </section>

      {Array.isArray(stocksList) ? (
        <section class="result-section">
          {showTotal ? (
            <section class="summary">
              <div>Total Taxable Income: {totalIncome}</div>
              <div>Income tax Owed: {taxOwed}</div>
              <div>Income before expenses and savings: {profitBE}</div>
              <aside class="aside">
                The above rates do not include the Medicare levy of 2% or any
                low income offsets.
              </aside>
            </section>
          ) : (
            <section class="stocks-display">
              <div class="stock-header">
                <span>Code</span>
                <span>Buy Price</span>
                <span>Sell Price</span>
                <span>Volume</span>
                <span>Profit/Loss</span>
                <span></span>
              </div>
              <ul>
                {stocksList.map((item, index) => (
                  <StocksListItem
                    key={index}
                    index={index}
                    stockName={item.stockName}
                    buyPrice={item.buyPrice}
                    sellPrice={item.sellPrice}
                    volume={item.volume}
                    yearCheck={item.yearCheck}
                    deleteListItem={deleteListItem}
                    iProfit={iProfit}
                  />
                ))}
              </ul>
            </section>
          )}
        </section>
      ) : null}
    </article>
  );
};

export default StocksView;
