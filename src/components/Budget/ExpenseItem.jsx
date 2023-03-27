import React from "react";

const ExpenseItem = ({
  index,
  category,
  description,
  cost,
  deleteListItem,
}) => (
  <tr key={index}>
    <td>{category}</td>
    {description ? <td>{description}</td> : <td />}
    <td>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Math.round(cost * 100) / 100)}
    </td>
    <td>
      <button
        className="button delete"
        onClick={(e) => {
          e.preventDefault();
          deleteListItem(index);
        }}
      >
        X
      </button>
    </td>
  </tr>
);

export default ExpenseItem;
