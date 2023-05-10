import { createContext, useReducer } from 'react';

const demoStocks = [
  {
    stockName: 'AMP',
    buyPrice: 4,
    sellPrice: 10,
    volume: 1000,
    yearCheck: true,
    iProfit: 6000,
  },
  {
    stockName: 'ZIP',
    buyPrice: 4.35,
    sellPrice: 6.2,
    volume: 1000,
    yearCheck: true,
    iProfit: 1850,
  },

  {
    stockName: 'BHP',
    buyPrice: 20,
    sellPrice: 30,
    volume: 100,
    yearCheck: false,
    iProfit: 1000,
  },
  {
    stockName: 'A2M',
    buyPrice: 16,
    sellPrice: 11,
    volume: 200,
    yearCheck: true,
    iProfit: -1000,
  },
  {
    stockName: 'CBA',
    buyPrice: 70,
    sellPrice: 65,
    volume: 500,
    yearCheck: false,
    iProfit: -2500,
  },
];

const initialState = {
  taxBracket: 0,
  taxOwed: 0,
  profitBE: 0,
  stocksList: demoStocks,
  totalIncome: 0,
  salary: 0,
  yearCheck: false,
  //inputs
  showTotal: false,
  stockName: '',
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

      case 'updateStockName':
        return { ...state, stockName: payload };
      case 'updateBuyPrice':
        return { ...state, buyPrice: payload };
      case 'updateSellPrice':
        return { ...state, sellPrice: payload };
      case 'updateVolume':
        return { ...state, volume: payload };
      case 'updateShowTotal':
        return { ...state, showTotal: payload };

      //logicStates

      case 'updateProfitBE':
        return { ...state, profitBE: payload };
      case 'updateYearCheck':
        return { ...state, yearCheck: payload };
      case 'updateTaxBracket':
        return { ...state, taxBracket: payload };
      case 'updateTaxOwed':
        return { ...state, taxOwed: payload };
      case 'updateTotalIncome':
        return { ...state, totalIncome: payload };
      case 'updateSalary':
        return { ...state, salary: payload };
      case 'deleteStock':
        return {
          ...state,
          stocksList: payload,
        };
      case 'updateStocksList':
        return {
          ...state,
          stocksList: payload,
        };

      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StockStateProvider };
