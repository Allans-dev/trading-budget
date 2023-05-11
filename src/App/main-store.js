import { createContext, useReducer } from 'react';

const initialState = {
  isLoading: false,
  initialize: true,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'isLoading':
        return { ...state, isLoading: payload };
      //toggle first render
      case 'toggleFirstRender':
        return { ...state, initialize: false };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
