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
import CopyPasteField from './CopyPasteField';
import TextField from '@material-ui/core/TextField';
import { RepositorySecuredVariables_repository } from './__generated__/RepositorySecuredVariables_repository.graphql';
import { RepositorySecuredVariablesMutationResponse } from './__generated__/RepositorySecuredVariablesMutation.graphql';

const securedVariableMutation = graphql`
  mutation RepositorySecuredVariablesMutation($input: RepositorySecuredVariableInput!) {
    securedVariable(input: $input) {
      variableName
    }
  }
`;

interface Props {
  repository: RepositorySecuredVariables_repository;
}

interface State {
  inputValue: string;
  securedVariable?: string;
  securedVariableName?: string;
}

class RepositorySecuredVariables extends React.Component<Props, State> {
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
      // todo: simplify coping
      let valueForYAMLFile = `ENCRYPTED[${this.state.securedVariableName}]`;

      securedComponent = (
        <CopyPasteField name="securedVariable" multiline={true} fullWidth={true} value={valueForYAMLFile} />
      );
    }

    return (
      <Card>
        <CardHeader title="Secured Variables" />
        <CardContent>
          <FormControl style={{ width: '100%' }}>
            <TextField
              name="securedVariableValue"
              placeholder="Enter value to create a secure variable for"
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
        clientMutationId: this.props.repository.name, // todo: replace with a hash of valueToSecure
        repositoryId: parseInt(this.props.repository.id, 10),
        valueToSecure: valueToSecure,
      },
    };

    commitMutation(environment, {
      mutation: securedVariableMutation,
      variables: variables,
      onCompleted: (response: RepositorySecuredVariablesMutationResponse) => {
        this.setState({
          inputValue: valueToSecure,
          securedVariableName: response.securedVariable.variableName,
        });
      },
      onError: err => console.error(err),
    });
  }
}

export default createFragmentContainer(RepositorySecuredVariables, {
  repository: graphql`
    fragment RepositorySecuredVariables_repository on Repository {
      id
      owner
      name
    }
  `,
});
