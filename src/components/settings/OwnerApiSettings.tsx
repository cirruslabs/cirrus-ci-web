import React, { useState } from 'react';
import { commitMutation, useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { OwnerApiSettings_info$key } from './__generated__/OwnerApiSettings_info.graphql';
import {
  GenerateNewOwnerAccessTokenInput,
  OwnerApiSettingsMutationResponse,
} from './__generated__/OwnerApiSettingsMutation.graphql';
import environment from '../../createRelayEnvironment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import OwnerScopedTokenDialog from './OwnerScopedTokenDialog';

const generateNewTokenMutation = graphql`
  mutation OwnerApiSettingsMutation($input: GenerateNewOwnerAccessTokenInput!) {
    generateNewOwnerAccessToken(input: $input) {
      token
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
    textField: {
      width: '100%',
      marginLeft: theme.spacing(1.0),
      marginRight: theme.spacing(1.0),
    },
  };
});

interface Props {
  info: OwnerApiSettings_info$key;
}

export default function OwnerApiSettings(props: Props) {
  let info = useFragment(
    graphql`
      fragment OwnerApiSettings_info on OwnerInfo {
        platform
        uid
        apiToken {
          maskedToken
        }
        ...OwnerScopedTokenDialog_ownerInfo
      }
    `,
    props.info,
  );

  let classes = useStyles();
  let existingTokenComponent = null;
  let [newToken, setNewToken] = useState(null);
  let [openDialog, setOpenDialog] = useState(false);

  function generateNewAccessToken() {
    let input: GenerateNewOwnerAccessTokenInput = {
      clientMutationId: `generate-api-token-${info.uid}`,
      platform: info.platform,
      ownerUid: info.uid,
    };

    commitMutation(environment, {
      mutation: generateNewTokenMutation,
      variables: { input },
      onCompleted: (response: OwnerApiSettingsMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setNewToken(response.generateNewOwnerAccessToken.token);
      },
      onError: err => console.error(err),
    });
  }

  if (info.apiToken && info.apiToken.maskedToken) {
    existingTokenComponent = (
      <Typography variant="subtitle1">Currently active token: {info.apiToken.maskedToken}</Typography>
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
          {newToken ? null : existingTokenComponent}
          {newTokenComponent}
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={() => generateNewAccessToken()}>
            {info.apiToken ? 'Invalidate All Tokens' : 'Generate New Token'}
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Generate a scoped repository Token
          </Button>
        </CardActions>
      </Card>
      <OwnerScopedTokenDialog ownerInfo={info} open={openDialog} onClose={() => setOpenDialog(!openDialog)} />
    </div>
  );
}
