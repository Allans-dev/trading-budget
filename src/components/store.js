import { createContext, useReducer } from "react";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "newTotal":
        console.log(type, payload);
        return { ...state, profit: payload };
      case "addNPAT":
        return { ...state, NPAT: payload };
      case "addSavings":
        return { ...state, savings: payload };
      case "addExpenses":
        return { ...state, expenses: payload };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
