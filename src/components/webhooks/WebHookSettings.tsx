import React, { useState } from 'react';
import { useMutation, useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@mui/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeliveriesList from './DeliveriesList';
import { WebHookSettings_info$key } from './__generated__/WebHookSettings_info.graphql';
import FormHelperText from '@mui/material/FormHelperText';
import sjcl from 'sjcl/sjcl.js';
import {
  WebHookSettingsMutation,
  SaveWebHookSettingsInput,
  WebHookSettingsMutation$variables,
} from './__generated__/WebHookSettingsMutation.graphql';
import { Link } from '@mui/material';

const useStyles = makeStyles(theme => {
  return {
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  };
});

interface Props {
  info: WebHookSettings_info$key;
}

export default function WebHookSettings(props: Props) {
  let info = useFragment(
    graphql`
      fragment WebHookSettings_info on OwnerInfo {
        platform
        uid
        webhookSettings {
          webhookURL
          maskedSecretToken
        }
        webhookDeliveries(last: 50) {
          edges {
            node {
              ...DeliveryRow_delivery
            }
          }
        }
      }
    `,
    props.info,
  );

  let [expanded, setExpanded] = useState(false);
  let [webhookURL, setWebhookURL] = useState(info.webhookSettings.webhookURL || '');
  let [secretToken, setSecretToken] = useState('');
  let classes = useStyles();

  const [commitSecuredVariableMutation] = useMutation<WebHookSettingsMutation>(graphql`
    mutation WebHookSettingsMutation($input: SaveWebHookSettingsInput!) {
      saveWebHookSettings(input: $input) {
        error
        info {
          uid
          webhookSettings {
            webhookURL
            maskedSecretToken
          }
        }
      }
    }
  `);
  function saveWebhookSettings() {
    const variables: WebHookSettingsMutation$variables = {
      input: {
        clientMutationId: webhookURL,
        platform: info.platform,
        ownerUid: info.uid,
        webhookURL: webhookURL,
      },
    };

    if (secretToken !== '') {
      const secretTokenDigest = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(secretToken));
      variables.input.clientMutationId += `-${secretTokenDigest}`;
      variables.input['secretToken'] = secretToken;
    }

    commitSecuredVariableMutation({
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function resetSecretToken() {
    let input: SaveWebHookSettingsInput = {
      clientMutationId: `reset-${info.webhookSettings.maskedSecretToken}`,
      platform: info.platform,
      ownerUid: info.uid,
      webhookURL: info.webhookSettings.webhookURL,
      secretToken: '',
    };

    commitSecuredVariableMutation({
      variables: { input },
      onError: err => console.error(err),
    });
  }

  const hasTokenSet = info.webhookSettings != null && info.webhookSettings.maskedSecretToken !== '';
  const secretTokenControl = hasTokenSet ? (
    <FormControl style={{ width: '100%' }}>
      <FormHelperText>
        Currently the secret token is set to <code>{info.webhookSettings.maskedSecretToken}</code>, reset it first to
        set a new one:
      </FormHelperText>
      <Button variant="contained" onClick={resetSecretToken}>
        Reset Secret Token
      </Button>
    </FormControl>
  ) : (
    <FormControl style={{ width: '100%' }}>
      <FormHelperText>
        New secret token used to generate a signature for each request (learn how to validate the{' '}
        <code>X-Cirrus-Signature</code> header{' '}
        <Link
          color="inherit"
          href="https://cirrus-ci.org/api/#securing-webhooks"
          target="_blank"
          rel="noopener noreferrer"
        >
          in the documentation
        </Link>
        ):
      </FormHelperText>
      <TextField
        name="secretToken"
        placeholder="Enter secret token"
        value={secretToken}
        onChange={event => setSecretToken(event.target.value)}
        fullWidth={true}
      />
    </FormControl>
  );

  const webhookURLUnchanged = info.webhookSettings != null && info.webhookSettings.webhookURL === webhookURL;
  const secretTokenUnchanged = hasTokenSet || secretToken === '';

  return (
    <Card elevation={24}>
      <CardHeader title="Webhook Settings" />
      <CardContent>
        <FormControl style={{ width: '100%' }}>
          <FormHelperText>
            A URL to send{' '}
            <Link color="inherit" href="https://cirrus-ci.org/api/#webhooks" target="_blank" rel="noopener noreferrer">
              updates for builds and tasks
            </Link>{' '}
            to:
          </FormHelperText>
          <TextField
            name="webhookURL"
            placeholder="Enter webhook URL"
            value={webhookURL}
            onChange={event => setWebhookURL(event.target.value)}
            fullWidth={true}
          />
        </FormControl>
        {secretTokenControl}
      </CardContent>
      <CardActions disableSpacing>
        <Button
          variant="contained"
          disabled={webhookURLUnchanged && secretTokenUnchanged}
          onClick={saveWebhookSettings}
        >
          Save
        </Button>
        <IconButton
          className={classNames(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Show Deliveries"
          size="large"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <DeliveriesList deliveries={info.webhookDeliveries} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
