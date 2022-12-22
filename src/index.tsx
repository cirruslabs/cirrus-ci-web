import React from 'react';
import ReactDOM from 'react-dom';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import App from './App';
import './index.css';
import './rtu/ConnectionManager';
import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: process.env.REACT_APP_CIRRUS_CHANGE_IN_REPO,
  environment: process.env.NODE_ENV,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
  ],
  tracesSampleRate: 0.1,
});

let ProfiledApp = Sentry.withProfiler(App);

ReactDOM.render(
  <RecoilRoot>
    <ProfiledApp />
  </RecoilRoot>,
  document.getElementById('root'),
);
