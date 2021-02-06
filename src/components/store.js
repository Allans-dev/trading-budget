import { createContext, useReducer } from "react";

const initialState = {
  authStatus: false,
  yearCheck: false,
  netProfit: 0,
  grossProfit: 0,
  taxOwed: 0,
  taxableIncome: 0,
  taxBracket: 0,
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
      case "updateBudget":
        return { ...state, budget: payload };
      case "updateSavings":
        return { ...state, savings: payload };
      case "updateYearCheck":
        return { ...state, yearCheck: payload };
      case "updateTaxBracket":
        return { ...state, taxBracket: payload };
      case "updateTaxOwed":
        return { ...state, taxOwed: payload };
      case "updateTaxableIncome":
        return { ...state, taxableIncome: payload };
      case "updateStocksList":
        return { ...state, stocksList: payload };
      case "updateExpenses":
        return { ...state, expenseArray: payload };
      case "totalExpenses":
        return { ...state, totalExpenses: payload };
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
