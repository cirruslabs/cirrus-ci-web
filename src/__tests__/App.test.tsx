import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { RecoilRoot } from 'recoil';

describe('App component tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
      div,
    );
  });
});
