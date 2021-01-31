import { createContext, useReducer } from "react";

const initialState = { authStatus: false };

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "newTotal":
        return { ...state, profit: payload };
      case "addNPAT":
        return { ...state, NPAT: payload };
      case "addSavings":
        return { ...state, savings: payload };
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
