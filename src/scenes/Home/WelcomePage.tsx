import React from 'react';
import Paper from '@mui/material/Paper';
import withStyles from '@mui/styles/withStyles';
import { Helmet as Head } from 'react-helmet';
import MarkdownTypography from '../../components/common/MarkdownTypography';

const styles = theme => ({
  paper: {
    padding: theme.spacing(3.0),
    margin: theme.spacing(1.0),
  },
});

let welcomePage = props => (
  <Paper className={props.classes.paper}>
    <Head>
      <title>Welcome - Cirrus CI</title>
    </Head>
    <MarkdownTypography text={'# Welcome to Cirrus CI.'} />
    <MarkdownTypography
      text={'Please [**sign in**](https://api.cirrus-ci.com/redirect/auth/github) to see your recent builds.'}
    />
    <MarkdownTypography text={'Just got here? Visit [**our documentation**](https://cirrus-ci.org).'} />
  </Paper>
);

export default withStyles(styles)(welcomePage);
