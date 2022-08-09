import React, { useState } from 'react';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { OwnerApiSettings_info } from './__generated__/OwnerApiSettings_info.graphql';
import {
  GenerateNewOwnerAccessTokenInput,
  OwnerApiSettingsMutationResponse,
} from './__generated__/OwnerApiSettingsMutation.graphql';
import createStyles from '@mui/styles/createStyles';
import environment from '../../createRelayEnvironment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Link } from '@mui/material';
import { withStyles, WithStyles } from '@mui/styles';

const generateNewTokenMutation = graphql`
  mutation OwnerApiSettingsMutation($input: GenerateNewOwnerAccessTokenInput!) {
    generateNewOwnerAccessToken(input: $input) {
      token
    }
  }
`;

const styles = theme =>
  createStyles({
    textField: {
      width: '100%',
      marginLeft: theme.spacing(1.0),
      marginRight: theme.spacing(1.0),
    },
  });

interface Props extends WithStyles<typeof styles> {
  info: OwnerApiSettings_info;
}

function OwnerApiSettings(props: Props) {
  let { classes } = props;
  let existingTokenComponent = null;
  let [newToken, setNewToken] = useState(null);

  function generateNewAccessToken() {
    let input: GenerateNewOwnerAccessTokenInput = {
      clientMutationId: `generate-api-token-${props.info.uid}`,
      platform: props.info.platform,
      ownerUid: props.info.uid,
    };

    commitMutation(environment, {
      mutation: generateNewTokenMutation,
      variables: { input },
      onCompleted: (response: OwnerApiSettingsMutationResponse) => {
        setNewToken(response.generateNewOwnerAccessToken.token);
      },
      onError: err => console.error(err),
    });
  }

  if (props.info.apiToken.maskedToken) {
    existingTokenComponent = (
      <Typography variant="subtitle1">Currently active token: {props.info.apiToken.maskedToken}</Typography>
    );
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
            <Link color="inherit" href="https://cirrus-ci.org/api/">
              documentation
            </Link>{' '}
            for more details.
          </Typography>
          {existingTokenComponent}
          {newTokenComponent}
        </CardContent>
        {cardActions}
      </Card>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(OwnerApiSettings), {
  info: graphql`
    fragment OwnerApiSettings_info on OwnerInfo {
      platform
      uid
      apiToken {
        maskedToken
      }
    }
  `,
});
