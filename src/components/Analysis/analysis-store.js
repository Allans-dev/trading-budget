import { createContext, useReducer } from "react";

const initialState = {
  stocksList: [
    {
      stockName: "BHP",
      buyPrice: 20,
      sellPrice: 30,
      volume: 100,
      yearCheck: true,
      iProfit: 1000,
    },
    {
      stockName: "CBA",
      buyPrice: 70,
      sellPrice: 65,
      volume: 50,
      yearCheck: false,
      iProfit: -250,
    },
  ],
  expenseArray: [
    {
      category: "Groceries",
      description: "food",
      cost: "40",
    },
    {
      category: "Shopping",
      description: "shirt",
      cost: "30",
    },
  ],
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
