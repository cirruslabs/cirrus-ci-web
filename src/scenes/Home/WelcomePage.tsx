import React from 'react';
import Paper from '@mui/material/Paper';
import ReactMarkdown from 'react-markdown';
import withStyles from '@mui/styles/withStyles';
import { Helmet as Head } from 'react-helmet';

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
    <ReactMarkdown># Welcome to Cirrus CI.</ReactMarkdown>
    <ReactMarkdown>
      Please [**sign in**](https://api.cirrus-ci.com/redirect/auth/github) to see your recent builds.
    </ReactMarkdown>
    <ReactMarkdown>Just got here? Visit [**our documentation**](https://cirrus-ci.org).</ReactMarkdown>
  </Paper>
);

export default withStyles(styles)(welcomePage);
