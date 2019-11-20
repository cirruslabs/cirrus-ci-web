import React from 'react';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';

export default withStyles({
  paper: {
    padding: '35px',
    margin: '15px',
  },
})(props => {
  return (
    <Paper
      style={{
        padding: '35px',
        margin: '15px',
      }}
    >
      <ReactMarkdown># Welcome to Cirrus CI.</ReactMarkdown>
      <ReactMarkdown>
        Please [**sign in**](https://api.cirrus-ci.com/redirect/auth/github) to see your recent builds.
      </ReactMarkdown>
      <ReactMarkdown>Just got here? Visit [**our documentation**](https://cirrus-ci.org).</ReactMarkdown>
    </Paper>
  );
});
