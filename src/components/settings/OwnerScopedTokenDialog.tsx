import React, { useState } from 'react';
import { useMutation, useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

import {
  OwnerScopedTokenDialogMutation,
  OwnerScopedTokenDialogMutation$data,
  OwnerScopedTokenDialogMutation$variables,
} from './__generated__/OwnerScopedTokenDialogMutation.graphql';
import { OwnerScopedTokenDialog_ownerInfo$key } from './__generated__/OwnerScopedTokenDialog_ownerInfo.graphql';

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
  ownerInfo: OwnerScopedTokenDialog_ownerInfo$key;

  onClose(...args: any[]): void;

  open: boolean;
}

export default function OwnerScopedTokenDialog(props: Props) {
  let ownerInfo = useFragment(
    graphql`
      fragment OwnerScopedTokenDialog_ownerInfo on OwnerInfo {
        platform
        uid
      }
    `,
    props.ownerInfo,
  );

  let classes = useStyles();
  let [readOnly, setReadOnly] = useState(true);
  let [expirationDays, setExpirationDays] = useState<number | null>(null);
  let [repositoryNames, setRepositoryNames] = useState('');
  let [newToken, setNewToken] = useState<string | null>(null);

  const [commitGenerateNewScopedAccessTokenMutation] = useMutation<OwnerScopedTokenDialogMutation>(
    graphql`
      mutation OwnerScopedTokenDialogMutation($input: GenerateNewScopedAccessTokenInput!) {
        generateNewScopedAccessToken(input: $input) {
          token
        }
      }
    `,
  );
  function generateToken() {
    const variables: OwnerScopedTokenDialogMutation$variables = {
      input: {
        clientMutationId: 'generate-scoped-token-' + ownerInfo.uid + repositoryNames,
        platform: ownerInfo.platform,
        ownerUid: ownerInfo.uid,
        repositoryNames: repositoryNames.split(','),
        permission: readOnly ? 'READ' : 'WRITE',
        durationSeconds: 24 * 60 * 60 * (expirationDays || 0),
      },
    };
    commitGenerateNewScopedAccessTokenMutation({
      variables: variables,
      onCompleted: (response: OwnerScopedTokenDialogMutation$data, errors) => {
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

  let newTokenComponent: null | JSX.Element = null;
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
    <Dialog
      onClose={() => {
        setNewToken(null);
        props.onClose();
      }}
      open={props.open}
    >
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
        <Button
          onClick={() => {
            setNewToken(null);
            props.onClose();
          }}
          color="secondary"
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
