import React from 'react';
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
import { WebHookSettingsMutationResponse } from './__generated__/WebHookSettingsMutation.graphql';

const securedVariableMutation = graphql`
  mutation WebHookSettingsMutation($input: SaveWebHookSettingsInput!) {
    saveWebHookSettings(input: $input) {
      error
      info {
        webhookSettings {
          webhookURL
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

interface State {
  expanded: boolean;
  initialURL: string;
  inputValue: string;
}

class WebHookSettings extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    let initialURL = props.info.webhookSettings.webhookURL || '';
    this.state = {
      expanded: false,
      initialURL: initialURL,
      inputValue: initialURL,
    };
  }

  handleChange = event => {
    let inputValue = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      inputValue: inputValue,
    }));
  };

  handleExpandClick = () => {
    this.setState(prevState => ({
      ...prevState,
      expanded: !prevState.expanded,
    }));
  };

  render() {
    let { info, classes } = this.props;
    return (
      <Card>
        <CardHeader title="Webhook Settings" />
        <CardContent>
          <FormControl style={{ width: '100%' }}>
            <TextField
              name="webhookURL"
              placeholder="Enter webhook URL"
              value={this.state.inputValue}
              onChange={this.handleChange}
              fullWidth={true}
            />
          </FormControl>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            variant="contained"
            disabled={this.state.inputValue === this.state.initialURL}
            onClick={() => this.saveWebHookURL()}
          >
            Save
          </Button>
          <IconButton
            className={classNames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show Deliveries"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <DeliveriesList deliveries={info.webhookDeliveries} />
          </CardContent>
        </Collapse>
      </Card>
    );
  }

  saveWebHookURL() {
    let webhookURL = this.state.inputValue;
    const variables = {
      input: {
        clientMutationId: webhookURL,
        accountId: this.props.info.id,
        webhookURL: webhookURL,
      },
    };

    commitMutation(environment, {
      mutation: securedVariableMutation,
      variables: variables,
      onCompleted: (response: WebHookSettingsMutationResponse) => {
        let settings = response.saveWebHookSettings.info;
        let savedWebhookURL = settings.webhookSettings.webhookURL;
        this.setState(prevState => ({
          ...prevState,
          initialURL: savedWebhookURL,
          inputValue: savedWebhookURL,
        }));
      },
      onError: err => console.error(err),
    });
  }
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
