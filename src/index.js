import React from 'react';
import ReactDOM from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

injectTapEventPlugin(); // for fancy material ui effects
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
