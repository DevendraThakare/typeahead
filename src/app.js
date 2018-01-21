import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./reducers";
import thunk from 'redux-thunk'
import HomePage from "./containers/homePage";

const initialState = {};
const store = createStore(reducers, initialState, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <HomePage />
  </Provider>,
  document.getElementById("app")
);
