import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './rtu/ConnectionManager';
import { RecoilRoot } from 'recoil';

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root'),
);
