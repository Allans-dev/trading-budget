import { createContext, useReducer } from "react";

const initialState = {
  stocksList: [],
  expenseArray: [],
};

const store = createContext(initialState);
const { Provider } = store;

const AnalysisStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "updateStocksList":
        return {
          ...state,
          stocksList: Array.isArray(payload) ? [...payload] : payload,
        };
      case "updateExpenses":
        return {
          ...state,
          expenseArray: Array.isArray(payload) ? [...payload] : payload,
        };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, AnalysisStateProvider };
