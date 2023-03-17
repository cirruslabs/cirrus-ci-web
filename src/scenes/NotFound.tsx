import React, { useEffect } from 'react';
import Icon from '@mui/material/Icon';
import { Box, Link, Typography } from '@mui/material';

export default function NotFound(props) {
  useEffect(() => {
    document.title = 'Page Not Found - Cirrus CI';
  }, []);
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
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
}
