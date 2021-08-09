import { createContext, useReducer } from "react";

const initialState = {
  taxBracket: 0,
  taxOwed: 0,
  profitBE: 0,
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
  totalIncome: 0,
  salary: 0,
  //inputs
  showTotal: false,
  stockName: "",
  buyPrice: 0,
  sellPrice: 0,
  volume: 0,
  income: 0,
};

const store = createContext(initialState);
const { Provider } = store;

const StockStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      //inputStates

      case "updateStockName":
        return { ...state, stockName: payload };
      case "updateBuyPrice":
        return { ...state, buyPrice: payload };
      case "updateSellPrice":
        return { ...state, sellPrice: payload };
      case "updateVolume":
        return { ...state, volume: payload };
      case "updateShowTotal":
        return { ...state, showTotal: payload };

      //logicStates

      case "updateProfitBE":
        return { ...state, profitBE: payload };
      case "updateYearCheck":
        return { ...state, yearCheck: payload };
      case "updateTaxBracket":
        return { ...state, taxBracket: payload };
      case "updateTaxOwed":
        return { ...state, taxOwed: payload };
      case "updateTotalIncome":
        return { ...state, totalIncome: payload };
      case "updateSalary":
        return { ...state, salary: payload };
      case "updateStocksList":
        return {
          ...state,
          stocksList: Array.isArray(payload) ? [...payload] : payload,
        };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StockStateProvider };
