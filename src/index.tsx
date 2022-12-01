import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './rtu/ConnectionManager';
import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';

try {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
  });
} catch (error) {
  console.error(error);
}

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root'),
);
