import { createContext, useReducer } from "react";

const initialState = {
  netProfit: 0,

  savingsRate: 20,
  profitBE: 0,
  expenseArray: [],
  totalExpenses: 0,
  totalSavings: 0,

  category: "Groceries",
  displayResults: false,
};

const store = createContext(initialState);
const { Provider } = store;

const BudgetStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "updateNetProfit":
        return { ...state, netProfit: payload };
      case "updateTotalSavings":
        return { ...state, totalSavings: payload };
      case "updateExpenses":
        return { ...state, expenseArray: payload };
      case "updateTotalExpenses":
        return { ...state, totalExpenses: payload };
      case "updateSavingsRate":
        return { ...state, savingsRate: payload };

      // previously useState Hooks

      case "updateDisplayResults":
        return { ...state, displayResults: payload };
      case "updateTimeFrame":
        return { ...state, timeFrame: payload };
      case "updateCategory":
        return { ...state, category: payload };
      case "updateDescription":
        return { ...state, description: payload };
      case "updateCost":
        return { ...state, cost: payload };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, BudgetStateProvider };
