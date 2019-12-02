import React from 'react';
import environment from '../createRelayEnvironment';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core';
import CopyPasteField from './CopyPasteField';
import TextField from '@material-ui/core/TextField';
import { OrganizationSecuredVariablesMutationResponse } from './__generated__/OrganizationSecuredVariablesMutation.graphql';
import { OrganizationSecuredVariables_info } from './__generated__/OrganizationSecuredVariables_info.graphql';

const securedVariableMutation = graphql`
  mutation OrganizationSecuredVariablesMutation($input: OrganizationSecuredVariableInput!) {
    securedOrganizationVariable(input: $input) {
      variableName
    }
  }
`;

interface Props {
  info: OrganizationSecuredVariables_info;
}

interface State {
  securedVariableName?: string;
  securedVariable?: string;
  inputValue: string;
}

class OrganizationSecuredVariables extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  render() {
    let securedComponent = null;

    if (this.state.securedVariableName) {
      let valueForYAMLFile = `ENCRYPTED[${this.state.securedVariableName}]`;

      securedComponent = (
        <CopyPasteField name="securedVariable" multiline={true} fullWidth={true} value={valueForYAMLFile} />
      );
    }

    return (
      <Card>
        <CardHeader title="Organization-Level Secured Variables" />
        <CardContent>
          <FormControl style={{ width: '100%' }}>
            <TextField
              name="securedVariableValue"
              placeholder="Value to create a secure variable for"
              value={this.state.inputValue}
              disabled={this.state.securedVariable !== undefined}
              onChange={this.handleChange}
              multiline={true}
              fullWidth={true}
            />
            {securedComponent}
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            disabled={this.state.inputValue === ''}
            onClick={() => this.encryptCurrentValue()}
          >
            Encrypt
          </Button>
        </CardActions>
      </Card>
    );
  }

  encryptCurrentValue() {
    let valueToSecure = this.state.inputValue;
    const variables = {
      input: {
        clientMutationId: this.props.info.name,
        organizationId: parseInt(this.props.info.id, 10),
        valueToSecure: valueToSecure,
      },
    };

    commitMutation(environment, {
      mutation: securedVariableMutation,
      variables: variables,
      onCompleted: (response: OrganizationSecuredVariablesMutationResponse) => {
        this.setState({
          inputValue: valueToSecure,
          securedVariableName: response.securedOrganizationVariable.variableName,
        });
      },
      onError: err => console.error(err),
    });
  }
}

export default createFragmentContainer(withStyles({})(OrganizationSecuredVariables), {
  info: graphql`
    fragment OrganizationSecuredVariables_info on GitHubOrganizationInfo {
      id
      name
    }
  `,
});
