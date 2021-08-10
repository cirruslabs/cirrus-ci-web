import React, { useState } from 'react';
import environment from '../../createRelayEnvironment';
import { commitMutation, createPaginationContainer, RelayPaginationProp } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeliveriesList from './DeliveriesList';
import { WebHookSettings_info } from './__generated__/WebHookSettings_info.graphql';
import FormHelperText from '@material-ui/core/FormHelperText';
import sjcl from 'sjcl/sjcl.js';

const securedVariableMutation = graphql`
  mutation WebHookSettingsMutation($input: SaveWebHookSettingsInput!) {
    saveWebHookSettings(input: $input) {
      error
      info {
        webhookSettings {
          webhookURL
          maskedSecretToken
        }
      }
    }
  }
`;

const styles = theme =>
  createStyles({
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
  });

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  info: WebHookSettings_info;
  relay: RelayPaginationProp;
}

function WebHookSettings(props: Props) {
  let [expanded, setExpanded] = useState(false);
  let [webhookURL, setWebhookURL] = useState(props.info.webhookSettings.webhookURL || '');
  let [secretToken, setSecretToken] = useState('');
  let { info, classes } = props;

  function saveWebhookSettings() {
    const variables = {
      input: {
        clientMutationId: webhookURL,
        accountId: props.info.id,
        webhookURL: webhookURL,
      },
    };

    if (secretToken !== '') {
      const secretTokenDigest = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(secretToken));
      variables.input.clientMutationId += `-${secretTokenDigest}`;
      variables.input['secretToken'] = secretToken;
    }

    commitMutation(environment, {
      mutation: securedVariableMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function resetSecretToken() {
    const variables = {
      input: {
        clientMutationId: `reset-${props.info.webhookSettings.maskedSecretToken}`,
        accountId: props.info.id,
        webhookURL: props.info.webhookSettings.webhookURL,
        secretToken: '',
      },
    };

    commitMutation(environment, {
      mutation: securedVariableMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  const hasTokenSet = props.info.webhookSettings != null && props.info.webhookSettings.maskedSecretToken !== '';
  const secretTokenControl = hasTokenSet ? (
    <FormControl style={{ width: '100%' }}>
      <FormHelperText>
        Currently the secret token is set to <code>{props.info.webhookSettings.maskedSecretToken}</code>, reset it first
        to set a new one:
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
        <a href="https://cirrus-ci.org/api/#securing-webhooks" target="_blank" rel="noopener noreferrer">
          in the documentation
        </a>
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

  const webhookURLUnchanged =
    props.info.webhookSettings != null && props.info.webhookSettings.webhookURL === webhookURL;
  const secretTokenUnchanged = hasTokenSet || secretToken === '';

  return (
    <Card>
      <CardHeader title="Webhook Settings" />
      <CardContent>
        <FormControl style={{ width: '100%' }}>
          <FormHelperText>
            A URL to send{' '}
            <a href="https://cirrus-ci.org/api/#webhooks" target="_blank" rel="noopener noreferrer">
              updates for builds and tasks
            </a>{' '}
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

export default createPaginationContainer(
  withStyles(styles)(withRouter(WebHookSettings)) as typeof WebHookSettings,
  {
    info: graphql`
      fragment WebHookSettings_info on GitHubOrganizationInfo
      @argumentDefinitions(count: { type: "Int", defaultValue: 50 }, cursor: { type: "String" }) {
        id
        webhookSettings {
          webhookURL
          maskedSecretToken
        }
        webhookDeliveries(last: $count, after: $cursor) @connection(key: "WebHookSettings_webhookDeliveries") {
          edges {
            node {
              ...DeliveryRow_delivery
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props: any) {
      return props.info && props.info.deliveries;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count: count,
        cursor: cursor,
        organization: props.info.name,
      };
    },
    query: graphql`
      query WebHookSettingsQuery($count: Int!, $cursor: String, $organization: String!) {
        githubOrganizationInfo(organization: $organization) {
          ...WebHookSettings_info @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
