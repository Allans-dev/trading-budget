import { createContext, useReducer } from "react";

const initialState = {
  authStatus: false,
  netProfit: 0,
  taxBracket: 0,
  savingsRate: 20,
  taxOwed: 0,
  stocksList: [
    {
      stockName: "AAPL",
      buyPrice: 100,
      sellPrice: 150,
      volume: 4,
      iProfit: 0,
      yearCheck: true,
    },
  ],
  profitBE: 0,
  totalIncome: 0,
  totalExpenses: 0,
  totalSavings: 0,
  totalStocksIncome: 0,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "updateProfitBE":
        return { ...state, profitBE: payload };
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
      case "updateTotalIncome":
        return { ...state, totalIncome: payload };
      case "updateIProfit":
        return { ...state, iProfit: payload };
      case "updateStocksList":
        return {
          ...state,
          stocksList: Array.isArray(payload) ? [...payload] : payload,
        };
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
