import React from 'react';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core';

const styles = theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1.0) * 3,
      margin: theme.spacing(1.0),
    },
  });

let welcomePage = props => {
  return (
    <Paper className={props.classes.paper}>
      <ReactMarkdown># Welcome to Cirrus CI.</ReactMarkdown>
      <ReactMarkdown>
        Please [**sign in**](https://api.cirrus-ci.com/redirect/auth/github) to see your recent builds.
      </ReactMarkdown>
      <ReactMarkdown>Just got here? Visit [**our documentation**](https://cirrus-ci.org).</ReactMarkdown>
    </Paper>
  );
};

export default withStyles(styles)(welcomePage);
