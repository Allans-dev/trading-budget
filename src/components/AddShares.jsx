import React, { useState } from "react";

import "../style/add_shares.css";

const AddShares = () => {
  const [shareName, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState(null);
  const [sellPrice, setSellPrice] = useState(null);
  const [numberOfShares, setNumberOfShares] = useState(null);
  const [showTotal, setShowTotal] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setShowTotal(true);
  }

  return (
    <>
      <form className="sharesForm" onSubmit={handleSubmit} >
        <label>
          Share Name:
          <input type="text" value={shareName} onChange={e => setName(e.target.value) }/>
        </label>
        <label>
          Unit Price (Bought):
          <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value) } required/>
        </label>
        <label>
          Unit Price (Sold):
          <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value) } required/>
        </label>
        <label>
          Number of Shares:
          <input type="number" value={numberOfShares} onChange={e => setNumberOfShares(e.target.value) } required/>
        </label>
        <input type="submit" value="Submit" />
      </form>

      {showTotal ? <span> Gross Profit = {(sellPrice - buyPrice) * numberOfShares} </span> : null }

    </>
  );
}

export default AddShares;