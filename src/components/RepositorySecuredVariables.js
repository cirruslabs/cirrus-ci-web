import React from 'react';
import environment from '../createRelayEnvironment';
import {commitMutation, graphql} from 'react-relay';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const securedVariableMutation = graphql`
  mutation RepositorySecuredVariablesMutation($input: RepositorySecuredVariableInput!) {
    securedVariable(input: $input) {
      variableName
    }
  }
`;

class RepositorySecuredVariables extends React.Component {
  constructor(props) {
    super();
    this.state = {inputValue: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({inputValue: event.target.value});
  }

  render() {
    let securedComponent = null;

    if (this.state.securedVariableName) {
      // todo: simplify coping
      let valueForYAMLFile = "ENCRYPTED[" + this.state.securedVariableName + "]";

      securedComponent = (
        <CardText expandable={true}>
          <TextField name="securedVariable"
                     multiLine={true}
                     fullWidth={true}
                     disabled={true}
                     value={valueForYAMLFile}/>
        </CardText>
      )
    }

    return (
      <Card>
        <CardHeader
          title="Secured Variables"
          actAsExpander={true}
          showExpandableButton={true}
          avatar={<FontIcon className="material-icons">lock</FontIcon>}
        />
        <CardText expandable={true}>
          <TextField
            name="securedVariableValue"
            hintText="Enter value to create a secure variable for"
            value={this.state.inputValue}
            disabled={this.state.securedVariable !== undefined}
            onChange={this.handleChange}
            multiLine={true}
            fullWidth={true}/>
        </CardText>
        {securedComponent}
        <CardActions expandable={true}>
          <RaisedButton primary={true}
                        label="Encrypt"
                        disabled={this.state.inputValue === ''}
                        onTouchTap={() => this.encryptCurrentValue()}/>
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

    commitMutation(
      environment,
      {
        mutation: securedVariableMutation,
        variables: variables,
        onCompleted: (response) => {
          this.setState(
            {
              inputValue: valueToSecure,
              securedVariableName: response.securedVariable.variableName
            }
          );
        },
        onError: err => console.error(err),
      },
    );
  }
}

export default RepositorySecuredVariables;
