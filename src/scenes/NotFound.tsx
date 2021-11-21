import React from 'react';
import Icon from '@mui/material/Icon';
import { Helmet as Head } from 'react-helmet';
import { Box } from '@mui/material';

export default props => {
  return (
    <Box
      sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
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
    </Box>
  );
};
