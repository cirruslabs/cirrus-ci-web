import React, { useEffect } from 'react';

import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

import MarkdownTypography from 'components/common/MarkdownTypography';

const useStyles = makeStyles(theme => {
  return {
    paper: {
      padding: theme.spacing(3.0),
      margin: theme.spacing(1.0),
    },
  };
});

function WelcomePage() {
  let classes = useStyles();

  useEffect(() => {
    document.title = 'Welcome - Cirrus CI';
  }, []);
  return (
    <Paper className={classes.paper}>
      <MarkdownTypography text={'# Welcome to Cirrus CI.'} />
      <MarkdownTypography
        text={'Please [**sign in**](https://api.cirrus-ci.com/redirect/auth/github) to see your recent builds.'}
      />
      <MarkdownTypography text={'Just got here? Visit [**our documentation**](https://cirrus-ci.org).'} />
    </Paper>
  );
}

export default WelcomePage;
