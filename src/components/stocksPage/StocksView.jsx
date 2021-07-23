import React, { useContext } from "react";

import StocksListItem from "./StocksListItem";

import { store } from "./stocks-store";

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
    <article style={styles.article}>
      <section style={styles.formSection}>
        <form style={styles.form} onSubmit={addStocks}>
          <label style={styles.label}>
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
          <label style={styles.label}>
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
          <label style={styles.label}>
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
          <label style={styles.label}>
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
          <label style={styles.left}>
            Held more than 1 year?{" "}
            <input type="checkbox" id="yearCheckBox" onClick={oneYearCheck} />
          </label>

          <input type="submit" value="Add Shares" />

          <label style={styles.label}>
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
          <div>Total Taxable Income: {totalIncome}</div>
          <div>income tax Owed: {taxOwed}</div>
          <div>Take-home profits: {profitBE}</div>
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
  article: { textAlign: "center", paddingBottom: "58px" },
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

export default StocksView;
