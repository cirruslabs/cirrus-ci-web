import React from 'react';
import Icon from '@mui/material/Icon';
import { Helmet as Head } from 'react-helmet';
import { Box, Link, Typography } from '@mui/material';

export default props => {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
      <Head>
        <title>Page Not Found - Cirrus CI</title>
      </Head>
      <Box
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Icon style={{ fontSize: '96px' }}>sentiment_very_dissatisfied</Icon>
        {props.messageComponent ? (
          props.messageComponent
        ) : (
          <>
            <Typography variant="h2">{props.message || 'Page not found! '}</Typography>
            <Link href="https://cirrus-ci.com" color="inherit" variant="h3" title="Homepage">
              Go home?
            </Link>
          </>
        )}
      </Box>
    </Box>
  );
};
