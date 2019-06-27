import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import history from './history';
import { Provider } from "react-redux";
import { store } from "./store";

export const makeMainRoutes = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div>
          <Route path="/" component={App} />
        </div>
      </Router>
    </Provider>
  );
};
