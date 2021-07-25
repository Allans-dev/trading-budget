import React from "react";

const ExpenseItem = ({
  index,
  category,
  description,
  cost,
  deleteListItem,
}) => (
  <li style={styles.listItem} key={index}>
    {category === "Other" ? (
      <div style={styles.div}>{description}</div>
    ) : (
      <div style={styles.div}>{category}</div>
    )}
    {/* {description ? (
      <div style={styles.div}>{description}</div>
    ) : (
      <div style={styles.div} />
    )} */}
    <div style={styles.div}>{cost}</div>
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
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  div: {
    flex: 1,
    alignItems: "left",
  },
};

export default ExpenseItem;
