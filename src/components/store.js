import { createContext, useReducer } from "react";

const initialState = {
  authStatus: false,
  yearCheck: false,
  netProfit: 0,
  taxBracket: 0,
  savingsRate: 20,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "updateGrossProfit":
        return { ...state, grossProfit: payload };
      case "updateNetProfit":
        return { ...state, netProfit: payload };
      case "updateTotalSavings":
        return { ...state, totalSavings: payload };
      case "updateYearCheck":
        return { ...state, yearCheck: payload };
      case "updateTaxBracket":
        return { ...state, taxBracket: payload };
      case "updateTaxOwed":
        return { ...state, taxOwed: payload };
      case "updateIncome":
        return { ...state, income: payload };
      case "updateStocksList":
        return { ...state, stocksList: payload };
      case "updateExpenses":
        return { ...state, expenseArray: payload };
      case "updateTotalExpenses":
        return { ...state, totalExpenses: payload };
      case "updateSavingsRate":
        return { ...state, savingsRate: payload };
      case "login":
        return { ...state, authStatus: true };
      case "logout":
        return { ...state, authStatus: false };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
