import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/index";
import { configureStore } from "./store";
import { Provider } from "react-redux";

const store = configureStore();
console.log("state =", store.getState());
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
