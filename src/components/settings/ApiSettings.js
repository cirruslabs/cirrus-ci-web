import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import {commitMutation, createFragmentContainer, graphql} from 'react-relay';
import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import environment from "../../createRelayEnvironment";
import TextField from "@material-ui/core/TextField/TextField";


const styles = theme => ({
  textField: {
    width: "100%",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

const genereateNewTokenMutation = graphql`
  mutation ApiSettingsMutation($input: GenerateNewAccessTokenInput!) {
    generateNewAccessToken(input: $input) {
      token
    }
  }
`;


class ApiSettings extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = props.info.apiToken || {};
  }

  generateNewAccessToken() {
    const variables = {
      input: {
        clientMutationId: `generate-api-token-${this.props.info.id}`,
        accountId: this.props.info.id
      },
    };

    commitMutation(
      environment,
      {
        mutation: genereateNewTokenMutation,
        variables: variables,
        onCompleted: (response) => {
          console.log(response);
          let {generateNewAccessToken} = response;
          this.setState(prevState => ({
            ...prevState,
            newToken: generateNewAccessToken.token
          }));
        },
        onError: err => console.error(err),
      },
    );
  }

  render() {
    let {classes} = this.props;
    let existingTokenComponent = null;
    if (this.state.maskedToken) {
      existingTokenComponent = (
        <Typography variant="subheading">
          Current active token: {this.state.maskedToken}
        </Typography>
      );
    }
    let newTokenComponent = null;
    if (this.state.newToken) {
      newTokenComponent = (
        <TextField
          label="New Access Token"
          defaultValue={`Make sure to copy your new access token now. You won't be able to see it again!\n\n${this.state.newToken}`}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          info
          multiline
        />
      );
    }
    let cardActions = (
      <CardActions>
        <Button variant="contained"
                onClick={() => this.generateNewAccessToken()}>
          Generate New Token
        </Button>
      </CardActions>
    );

    if (this.props.info.role !== 'admin') {
      cardActions = null;
    }

    return (
      <div>
        <Paper elevation={1}>
          <Card>
            <CardHeader title="API Settings"/>
            <CardContent>
              <Typography variant="subheading">
                Need an API token for scripts or testing? Generate an organizational access token for quick access to
                the Cirrus CI API. See <a href="https://cirrus-ci.org/faq/">documentation</a> for more details.
              </Typography>
              {existingTokenComponent}
              {newTokenComponent}
            </CardContent>
            {cardActions}
          </Card>
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(ApiSettings)), {
  info: graphql`
    fragment ApiSettings_info on GitHubOrganizationInfo {
      id
      role
      apiToken {
        maskedToken
      }
    }
  `,
});
