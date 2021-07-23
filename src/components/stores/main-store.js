import { createContext, useReducer } from "react";

const initialState = {
  authStatus: false,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type } = action;
    switch (type) {
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
