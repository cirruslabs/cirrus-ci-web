import React, { useState } from 'react';
import { useFragment, useMutation } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';
import sjcl from 'sjcl/sjcl.js';

import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import { Avatar, ListItemAvatar } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

import DeliveriesList from './DeliveriesList';
import {
  WebHookDeliveryEndpointInput,
  WebHookSettingsMutation,
  WebHookSettingsMutation$data,
  WebHookSettingsMutation$variables,
} from './__generated__/WebHookSettingsMutation.graphql';
import { WebHookSettings_info$key } from './__generated__/WebHookSettings_info.graphql';

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
    cell: {
      padding: 0,
      height: '100%',
    },
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 4,
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
          ownerUid
          endpoints {
            webhookURL
            maskedSecretToken
          }
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

  let [openDialog, setOpenDialog] = useState(false);

  let [expanded, setExpanded] = useState(false);
  let convertedEndpoints: WebHookDeliveryEndpointInput[] = [];
  for (const endpoint of info.webhookSettings.endpoints) {
    convertedEndpoints.push({
      webhookURL: endpoint.webhookURL,
      secretToken: endpoint.maskedSecretToken,
    });
  }

  let [deliveryEndpoints, setDeliveryEndpoints] = useState(convertedEndpoints);
  let classes = useStyles();

  const [deleteWebHookSettingsMutation] = useMutation<WebHookSettingsMutation>(graphql`
    mutation WebHookSettingsDeleteMutation($input: SaveWebHookSettingsInput!) {
      saveWebHookSettings(input: $input) {
        error
        info {
          ...WebHookSettings_info
        }
      }
    }
  `);

  function deleteWebhookEndpoint(endpoint: WebHookDeliveryEndpointInput) {
    const newEndpoints = deliveryEndpoints.filter(e => e.webhookURL !== endpoint.webhookURL);

    const variables: WebHookSettingsMutation$variables = {
      input: {
        clientMutationId: sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(newEndpoints.join(','))),
        platform: info.platform,
        ownerUid: info.uid,
        deliveryEndpoints: newEndpoints,
      },
    };

    deleteWebHookSettingsMutation({
      variables: variables,
      onCompleted: () => setDeliveryEndpoints(newEndpoints),
      onError: err => console.error(err),
    });
  }

  return (
    <Card elevation={24}>
      <CardHeader title="Webhook Settings" />
      <CardContent>
        <List>
          {deliveryEndpoints.map(endpoint => (
            <ListItem
              key={endpoint.webhookURL}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon onClick={() => deleteWebhookEndpoint(endpoint)} />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <LinkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={endpoint.webhookURL}
                secondary={
                  endpoint.secretToken ? `Secured with '${endpoint.secretToken}' token` : 'Not secured with a token'
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions disableSpacing>
        <CreateWebHooEndpointDialog
          platform={info.platform}
          ownerUid={info.uid}
          existingEndpoints={deliveryEndpoints}
          open={openDialog}
          onClose={(updatedEndpoints) => {
            setDeliveryEndpoints(updatedEndpoints);
            setOpenDialog(!openDialog);
          }}
        />
        <Button variant="contained" onClick={() => setOpenDialog(!openDialog)}>
          Add New Webhook
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

interface DialogProps {
  ownerUid: string;
  platform: string;
  existingEndpoints: WebHookDeliveryEndpointInput[];

  open: boolean;

  onClose(updatedEndpoints: WebHookDeliveryEndpointInput[]): void;
}

function CreateWebHooEndpointDialog(props: DialogProps) {
  let [webHookURL, setWebHookURL] = useState('');
  let [secretToken, setSecretToken] = useState('');

  const [createWebHookSettingsMutation] = useMutation<WebHookSettingsMutation>(graphql`
    mutation WebHookSettingsCreateMutation($input: SaveWebHookSettingsInput!) {
      saveWebHookSettings(input: $input) {
        error
        info {
          ...WebHookSettings_info
        }
      }
    }
  `);

  function createEndpoint() {
    let newEndpoints = [...props.existingEndpoints];
    newEndpoints.push({
      webhookURL: webHookURL,
      secretToken: secretToken,
    });

    const variables: WebHookSettingsMutation$variables = {
      input: {
        clientMutationId: sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(newEndpoints.join(','))),
        platform: props.platform,
        ownerUid: props.ownerUid,
        deliveryEndpoints: newEndpoints,
      },
    };
    createWebHookSettingsMutation({
      variables: variables,
      onCompleted: (response: WebHookSettingsMutation$data, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        props.onClose(newEndpoints);
      },
      onError: err => console.log(err),
    });
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Create New WebHook Endpoint</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
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
            value={webHookURL}
            onChange={event => setWebHookURL(event.target.value)}
            fullWidth={true}
          />
        </FormControl>
        <FormControl fullWidth>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={createEndpoint} disabled={webHookURL === ''} variant="contained">
          Create
        </Button>
        <Button onClick={() => props.onClose(props.existingEndpoints)} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
