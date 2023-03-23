import React, { useContext } from "react";

import StocksListItem from "./StocksListItem";

// import firebase from "firebase/app";
// import "firebase/firestore";

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
    showTotal,
    totalIncome,
    taxOwed,
    profitBE,
    iProfit,
    stocksList,
  } = context.state;

  return (
    <article className="stocks-article">
      <section className="stocksFormSection">
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
          <label className="left">
            Held more than 1 year?{" "}
            <input type="checkbox" id="yearCheckBox" onClick={oneYearCheck} />
          </label>

          <button className="add-shares" onClick={addStocks}>
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

          <button className="button green" onClick={calculateProfit}>
            {" "}
            {showTotal ? "Show Stocks" : "Save and Calculate"}
          </button>
        </form>
      </section>

      {Array.isArray(stocksList) ? (
        <section className={stocksList.length > 0 ? `result-section` : `none`}>
          {showTotal ? (
            <section className="summary">
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
            <section className="stocks-display">
              <table>
                <tr>
                  <th>Code</th>
                  <th>Buy</th>
                  <th>Sell</th>
                  <th>Volume</th>
                  <th>Profit</th>
                  <th> &gt;year</th>
                </tr>
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
              </table>
            </section>
          )}
        </section>
      ) : null}
    </article>
  );
};

export default StocksView;
