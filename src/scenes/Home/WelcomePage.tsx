import React from 'react';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Helmet as Head } from 'react-helmet';

const styles = theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1.0) * 3,
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
