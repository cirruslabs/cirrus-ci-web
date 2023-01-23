import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import {makeStyles} from '@mui/styles';
import Switch from '@mui/material/Switch';
import {graphql} from 'babel-plugin-relay/macro';
import React, {useState} from 'react';
import {commitMutation, createFragmentContainer} from 'react-relay';
import environment from '../../createRelayEnvironment';
import {OwnerScopedTokenDialog_ownerInfo} from './__generated__/OwnerScopedTokenDialog_ownerInfo.graphql';
import {
  OwnerScopedTokenDialogMutationResponse,
  OwnerScopedTokenDialogMutationVariables,
} from './__generated__/OwnerScopedTokenDialogMutation.graphql';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles(theme => {
  return {
    textField: {
      width: '100%',
      marginLeft: theme.spacing(1.0),
      marginRight: theme.spacing(1.0),
    },
  };
});

const generateNewScopedAccessTokenMutation = graphql`
  mutation OwnerScopedTokenDialogMutation($input: GenerateNewScopedAccessTokenInput!) {
    generateNewScopedAccessToken(input: $input) {
      token
    }
  }
`;

interface Props {
  ownerInfo: OwnerScopedTokenDialog_ownerInfo;

  onClose(...args: any[]): void;

  open: boolean;
}

function OwnerScopedTokenDialog(props: Props) {
  let classes = useStyles();
  const { ...other } = props;
  let [readOnly, setReadOnly] = useState(true);
  let [expirationDays, setExpirationDays] = useState(null);
  let [repositoryNames, setRepositoryNames] = useState('');
  let [newToken, setNewToken] = useState(null);

  function generateToken() {
    const variables: OwnerScopedTokenDialogMutationVariables = {
      input: {
        clientMutationId: 'generate-scoped-token-' + props.ownerInfo.uid + repositoryNames,
        platform: props.ownerInfo.platform,
        ownerUid: props.ownerInfo.uid,
        repositoryNames: repositoryNames.split(','),
        permission: readOnly ? 'READ' : 'WRITE',
        durationSeconds: 24 * 60 * 60 * (expirationDays || 0),
      },
    };
    commitMutation(environment, {
      mutation: generateNewScopedAccessTokenMutation,
      variables: variables,
      onCompleted: (response: OwnerScopedTokenDialogMutationResponse, errors) => {
        if (errors) {
          setNewToken(`Failed to generate token!\n\n${errors.map(e => e.message).join('\n')}`);
        } else {
          setNewToken(
            `Make sure to copy your new access token now. You won't be able to see it again!\n\n${response.generateNewScopedAccessToken.token}`,
          );
        }
      },
      onError: err => setNewToken(`Failed to generate token!\n\n${err}`), // just show the error instead of token
    });
  }

  let newTokenComponent = null;
  if (newToken) {
    newTokenComponent = (
      <FormControl fullWidth>
        <TextField
          label="New Access Token"
          value={newToken}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          multiline
        />
      </FormControl>
    );
  }

  return (
    <Dialog {...other}>
      <DialogTitle>Generate API token for repositories</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <FormControlLabel
            control={<Switch checked={readOnly} onChange={event => setReadOnly(event.target.checked)} />}
            label="Read-only access"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="repositoryNames">Comma separated list of repository names</InputLabel>
          <Input
            id="repositoryNames"
            value={repositoryNames}
            error={repositoryNames === ''}
            onChange={event => setRepositoryNames(event.target.value)}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="invoiceTemplate">Expiration in days (Optional)</InputLabel>
          <Input
            id="expiration"
            value={expirationDays}
            onChange={event => setExpirationDays(parseInt(event.target.value, 10) || null)}
          />
        </FormControl>
        {newTokenComponent}
      </DialogContent>
      <DialogActions>
        <Button onClick={generateToken} disabled={repositoryNames === ''} variant="contained">
          Generate
        </Button>
        <Button onClick={props.onClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default createFragmentContainer(OwnerScopedTokenDialog, {
  ownerInfo: graphql`
    fragment OwnerScopedTokenDialog_ownerInfo on OwnerInfo {
      platform
      uid
    }
  `,
});
