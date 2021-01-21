import React from "react";

const ExpenseItem = ({ index, description, cost, deleteListItem }) => (
  <li style={styles.listItem} key={index}>
    <div>{description}</div>
    <div>{cost}</div>
    <button
      onClick={(e) => {
        e.preventDefault();
        deleteListItem(index);
      }}
    >
      -
    </button>
  </li>
);

const styles = {
  listItem: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
};

export default ExpenseItem;
