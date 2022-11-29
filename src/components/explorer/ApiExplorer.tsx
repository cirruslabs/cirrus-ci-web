import { useEffect } from 'react';
import { Helmet as Head } from 'react-helmet';
import { useTheme as useMuiTheme, Container } from '@mui/material';
import { useTheme as useGraphiqlTheme } from '@graphiql/react';
import { GraphiQLProvider, GraphiQLInterface } from 'graphiql';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import 'graphiql/graphiql.css';

const styles = theme =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      inset: '64px 0 0 0',
      background: theme.palette.mode === 'dark' ? '#212a3b' : '#fff',
      paddingLeft: theme.spacing(2.0),
      paddingRight: theme.spacing(2.0),
      paddingBottom: theme.spacing(1.0),
    },
  });

const query = `\
query {
  viewer {
    id
  }
}`;

const fetcher = async graphQLParams => {
  const data = await fetch('https://api.cirrus-ci.com/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'include',
  });
  return data.json().catch(() => data.text());
};

const ApiExplorer = () => {
  return (
    <GraphiQLProvider schema={undefined} query={query} fetcher={fetcher}>
      <Content />
    </GraphiQLProvider>
  );
};

const Content = withStyles(styles)(({ classes }: WithStyles<typeof styles>) => {
  const muiTheme = useMuiTheme().palette.mode;
  const setGraphiqlTheme = useGraphiqlTheme().setTheme;

  // apply mui theme to graphiql
  useEffect(() => {
    setGraphiqlTheme(muiTheme);
  }, [muiTheme]);

  return (
    <div className={classes.root}>
      <Head>
        <title>API Explorer - Cirrus CI</title>
      </Head>
      <Container maxWidth="lg">
        <GraphiQLInterface />
      </Container>
    </div>
  );
});

export default ApiExplorer;
