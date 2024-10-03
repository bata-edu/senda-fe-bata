import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import AppRoutes from './routes/AppRoutes';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
      <AppRoutes />
  </Provider>,
  document.getElementById('root')
);
