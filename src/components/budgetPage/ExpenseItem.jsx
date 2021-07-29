import React from "react";

const ExpenseItem = ({
  index,
  category,
  description,
  cost,
  deleteListItem,
}) => (
  <li key={index}>
    <div>{category}</div>
    {description ? <div>{description}</div> : <div />}
    <div>{cost}</div>
    <button
      class="button delete"
      onClick={(e) => {
        e.preventDefault();
        deleteListItem(index);
      }}
    >
      X
    </button>
  </li>
);

export default ExpenseItem;
