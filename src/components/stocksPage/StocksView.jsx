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
  } = context.state;

  return (
    <article class="article">
      <section class="formSection">
        <form class="form" onSubmit={addStocks}>
          <label class="label">
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
          <label class="label">
            Unit Price (Bought):
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
          <label class="label">
            Unit Price (Sold):
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
          <label class="label">
            Number of Shares:
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

          <label class="label">
            Annual income:
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

          <button onClick={calculateProfit}>Save and Calculate</button>
        </form>
      </section>

      {Array.isArray(stocksList) ? (
        <ul class="stocks-ul">
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
        <div class="profit">
          <div>Total Taxable Income: {totalIncome}</div>
          <div>income tax Owed: {taxOwed}</div>
          <div>Profit before expenses and savings: {profitBE}</div>
          <aside class="aside">
            The above rates do not include the Medicare levy of 2% or any low
            income offsets.
          </aside>
        </div>
      ) : null}
    </article>
  );
};

export default StocksView;
