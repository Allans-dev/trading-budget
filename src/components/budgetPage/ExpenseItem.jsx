import React from "react";

const ExpenseItem = ({
  index,
  category,
  description,
  cost,
  deleteListItem,
}) => (
  <li key={index}>
    {category === "Other" ? <div>{description}</div> : <div>{category}</div>}
    {/* {description ? (
      <div>{description}</div>
    ) : (
      <div />
    )} */}
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

export default ExpenseItem;
