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
    <div>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Math.round(cost * 100) / 100)}
    </div>
    <button
      className="button delete"
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
