import React from 'react';
import { commitMutation } from 'react-relay';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import environment from '../../createRelayEnvironment';
import TextField from '@material-ui/core/TextField';

const styles = theme =>
  createStyles({
    textField: {
      width: '100%',
      marginLeft: theme.spacing(1.0),
      marginRight: theme.spacing(1.0),
    },
  });

interface Props extends WithStyles<typeof styles> {
  apiToken: any;
  generateNewTokenMutation: any;
  getMutationVariables: () => {};
}

interface State {
  maskedToken: string;
  newToken: string;
}

class ApiSettingsBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = props.apiToken || {};
  }

  generateNewAccessToken() {
    commitMutation(environment, {
      mutation: this.props.generateNewTokenMutation,
      variables: this.props.getMutationVariables(),
      onCompleted: (response: { generateNewAccessToken: { token: string } }) => {
        let { generateNewAccessToken } = response;
        this.setState(prevState => ({
          ...prevState,
          newToken: generateNewAccessToken.token,
        }));
      },
      onError: err => console.error(err),
    });
  }

  render() {
    let { classes } = this.props;
    let existingTokenComponent = null;
    if (this.state.maskedToken) {
      existingTokenComponent = (
        <Typography variant="subtitle1">Currently active token: {this.state.maskedToken}</Typography>
      );
    }
    let newTokenComponent = null;
    if (this.state.newToken) {
      newTokenComponent = (
        <TextField
          label="New Access Token"
          value={`Make sure to copy your new access token now. You won't be able to see it again!\n\n${this.state.newToken}`}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          multiline
        />
      );
    }
    let cardActions = (
      <CardActions>
        <Button variant="contained" onClick={() => this.generateNewAccessToken()}>
          Generate New Token
        </Button>
      </CardActions>
    );

    return (
      <div>
        <Card>
          <CardHeader title="API Settings" />
          <CardContent>
            <Typography variant="subtitle1">
              Need an API token for scripts or testing? Generate an access token for the Cirrus CI API here. See the{' '}
              <a href="https://cirrus-ci.org/faq/">documentation</a> for more details.
            </Typography>
            {existingTokenComponent}
            {newTokenComponent}
          </CardContent>
          {cardActions}
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ApiSettingsBase);
