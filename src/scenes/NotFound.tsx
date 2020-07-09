import React from 'react';
import { Helmet as Head } from 'react-helmet';
import { Icon } from '@material-ui/core';

export default props => (
  <div
    className="row justify-content-between align-items-center"
    style={{ width: '100%', height: '100%', fontSize: '32px' }}
  >
    <Head>
      <title>Page Not Found - Cirrus CI</title>
    </Head>
    <div className="col text-center">
      <Icon style={{ fontSize: '96px' }} className="center-block">
        sentiment_very_dissatisfied
      </Icon>
      {props.messageComponent ? (
        props.messageComponent
      ) : (
        <div>
          <p>{props.message || 'Page not found! '}</p>
          <a href="https://cirrus-ci.com" title="Homepage">
            Go home?
          </a>
        </div>
      )}
    </div>
  </div>
);
