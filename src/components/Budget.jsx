const Budget = () => {
  const handleSavings = (e) => {
    e.preventDefault();
  };

  const calcBudget = (e) => {
    e.preventDefault();
  };

  const addExpense = (e) => {
    e.preventDefault();
  };

  return (
    <article style={styles.budget}>
      <form onSubmit={calcBudget}>
        <section style={styles.expense}>
          <label>
            Description: <input type="text" />
          </label>
          <br />
          <label>
            Cost: <input type="number" />
          </label>
        </section>
        <button style={styles.btnExpense} onClick={addExpense}>
          +
        </button>
        <label>
          Current timeframe:
          <select style={styles.timeframe}>
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="fortnight">fortnight</option>
            <option value="month">month</option>
            <option value="total">total</option>
          </select>
        </label>
        <section style={styles.savings}>
          <label>
            Savings Rate
            <input id="savings-rate" type="range" min={0} max={100}></input>
          </label>
          <button style={styles.btnSavings} onClick={handleSavings}>
            +
          </button>
        </section>

        <input style={styles.submit} type="submit" value="Calculate Budget" />
      </form>
    </article>
  );
};

const styles = {
  budget: { textAlign: "center" },
  expense: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    marginRight: "20%",
  },
  btnExpense: {
    display: "block",
    width: "60%",
    marginLeft: "20%",
    marginTop: "2%",
  },
  timeframe: { marginTop: "5%" },
  savings: { marginTop: "5%" },
  btnSavings: {
    display: "block",
    width: "60%",
    marginLeft: "20%",
    marginTop: "2%",
  },
  submit: { marginTop: "5%" },
};

export default Budget;
