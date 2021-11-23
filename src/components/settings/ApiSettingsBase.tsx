import React, { useState } from 'react';
import { commitMutation } from 'react-relay';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import environment from '../../createRelayEnvironment';
import TextField from '@mui/material/TextField';

const styles = theme =>
  createStyles({
    textField: {
      width: '100%',
      marginLeft: theme.spacing(1.0),
      marginRight: theme.spacing(1.0),
    },
  });

interface Props extends WithStyles<typeof styles> {
  maskedToken: string;
  generateNewTokenMutation: any;
  getMutationVariables: () => {};
}

function ApiSettingsBase(props: Props) {
  let [newToken, setNewToken] = useState(null);

  function generateNewAccessToken() {
    commitMutation(environment, {
      mutation: props.generateNewTokenMutation,
      variables: props.getMutationVariables(),
      onCompleted: (response: { generateNewAccessToken: { token: string } }) => {
        let { generateNewAccessToken } = response;
        setNewToken(generateNewAccessToken.token);
      },
      onError: err => console.error(err),
    });
  }

  let { classes } = props;
  let existingTokenComponent = null;

  if (props.maskedToken) {
    existingTokenComponent = <Typography variant="subtitle1">Currently active token: {props.maskedToken}</Typography>;
  }
  let newTokenComponent = null;
  if (newToken) {
    newTokenComponent = (
      <TextField
        label="New Access Token"
        value={`Make sure to copy your new access token now. You won't be able to see it again!\n\n${newToken}`}
        className={classes.textField}
        margin="normal"
        variant="outlined"
        multiline
      />
    );
  }

  let cardActions = (
    <CardActions>
      <Button variant="contained" onClick={() => generateNewAccessToken()}>
        Generate New Token
      </Button>
    </CardActions>
  );

  return (
    <div>
      <Card elevation={24}>
        <CardHeader title="API Settings" />
        <CardContent>
          <Typography variant="subtitle1">
            Need an API token for scripts or testing? Generate an access token for the Cirrus CI API here. See the{' '}
            <a href="https://cirrus-ci.org/api/">documentation</a> for more details.
          </Typography>
          {existingTokenComponent}
          {newTokenComponent}
        </CardContent>
        {cardActions}
      </Card>
    </div>
  );
}

export default withStyles(styles)(ApiSettingsBase);
