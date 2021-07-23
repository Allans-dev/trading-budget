import { createContext, useReducer } from "react";

const initialState = {
  netProfit: 0,

  savingsRate: 20,
  profitBE: 0,

  totalExpenses: 0,
  totalSavings: 0,
};

const store = createContext(initialState);
const { Provider } = store;

const BudgetStateProvider = ({ children }) => {
  const [mainState, dispatch] = useReducer((state, action) => {
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
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ mainState, dispatch }}>{children}</Provider>;
};

export { store, BudgetStateProvider };
