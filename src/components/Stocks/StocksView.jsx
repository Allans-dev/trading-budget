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
        <form>
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
              maxLength="6"
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
              maxLength="5"
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
              maxLength="5"
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
              maxLength="5"
              required
            />
          </label>
          <label class="left">
            Held more than 1 year?{" "}
            <input type="checkbox" id="yearCheckBox" onClick={oneYearCheck} />
          </label>

          <button class="add-shares" onClick={addStocks}>
            Add Shares
          </button>

          <label>
            Income:
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
        <section class={stocksList.length > 0 ? `result-section` : `none`}>
          {showTotal ? (
            <section class="summary">
              <span>Total Taxable Income: </span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Math.round(totalIncome * 100) / 100)}
              </span>
              <span>Income tax Owed: </span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Math.round(taxOwed * 100) / 100)}{" "}
              </span>
              <span>Take-Home Income: </span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Math.round(profitBE * 100) / 100)}
              </span>
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
