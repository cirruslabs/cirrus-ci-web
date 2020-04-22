import PropTypes from 'prop-types';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { createFragmentContainer } from 'react-relay';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import RepositoryMetricsCharts from './RepositoryMetricsCharts';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { RouteComponentProps } from 'react-router';
import { RepositoryMetricsPage_repository } from './__generated__/RepositoryMetricsPage_repository.graphql';
import { MetricsQueryParameters } from './__generated__/RepositoryMetricsChartsQuery.graphql';
import { Helmet as Head } from 'react-helmet';

const styles = theme =>
  createStyles({
    title: { 'text-align': 'center' },
    settingGap: {
      paddingTop: 16,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 180,
    },
  });

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  repository: RepositoryMetricsPage_repository;
}

interface State {
  parameters: MetricsQueryParameters;
}

class RepositoryMetricsPage extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props: Props) {
    super(props);
    this.state = { parameters: {} };
  }

  handleChange(event) {
    this.setState(oldState => ({
      ...oldState,
      parameters: {
        ...oldState.parameters,
        [event.target.name]: event.target.value,
      },
    }));
  }

  render() {
    let { classes } = this.props;
    let repository = this.props.repository;

    return (
      <div>
        <Head>
          <title>
            {repository.owner}/{repository.name}'s Metrics - Cirrus CI
          </title>
        </Head>
        <Paper elevation={1}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                {repository.owner}/{repository.name}'s Metrics
              </Typography>
              <Grid container direction="row" justify="center">
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="type-helper">Instance Type</InputLabel>
                  <Select
                    value={(this.state.parameters || {}).type || ''}
                    onChange={event => this.handleChange(event)}
                    input={<Input name="type" id="type-helper" />}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    <MenuItem value={'container'}>Linux Container</MenuItem>
                    <MenuItem value={'windows_container'}>Windows Container</MenuItem>
                    <MenuItem value={'osx_instance'}>macOS VM</MenuItem>
                    <MenuItem value={'pipe'}>Docker Pipe</MenuItem>
                    <MenuItem value={'freebsd_instance'}>FreeBSD Instance</MenuItem>
                    <MenuItem value={'gce_instance'}>GCE Instance</MenuItem>
                    <MenuItem value={'gke_container'}>GKE Container</MenuItem>
                    <MenuItem value={'gke_pipe'}>GKE Docker Pipe</MenuItem>
                    <MenuItem value={'ec2_instance'}>EC2 Instance</MenuItem>
                    <MenuItem value={'eks_container'}>EKS Container</MenuItem>
                    <MenuItem value={'aci_container'}>Azure Container Instances</MenuItem>
                    <MenuItem value={'anka_instance'}>Anka Instance</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="status-helper">Task Status</InputLabel>
                  <Select
                    value={(this.state.parameters || {}).status || ''}
                    onChange={event => this.handleChange(event)}
                    input={<Input name="status" id="status-helper" />}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    <MenuItem value={'FAILED'}>Failed</MenuItem>
                    <MenuItem value={'COMPLETED'}>Completed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="pr-helper">Pull Request</InputLabel>
                  <Select
                    value={(this.state.parameters || {}).isPR || ''}
                    onChange={event => this.handleChange(event)}
                    input={<Input name="isPR" id="pr-helper" />}
                  >
                    <MenuItem value="">
                      <em>All Tasks</em>
                    </MenuItem>
                    <MenuItem value="true">PR Tasks Only</MenuItem>
                    <MenuItem value="false">Non-PR Tasks Only</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="compute-credits-helper">Compute Credits</InputLabel>
                  <Select
                    value={(this.state.parameters || {}).usedComputeCredits || ''}
                    onChange={event => this.handleChange(event)}
                    input={<Input name="usedComputeCredits" id="compute-credits-helper" />}
                  >
                    <MenuItem value="" />
                    <MenuItem value="true">Used</MenuItem>
                    <MenuItem value="false">Not Used</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </CardContent>
          </Card>
        </Paper>
        <div className={classes.settingGap} />
        <RepositoryMetricsCharts
          repositoryId={repository.id}
          parameters={cleanEmptyOrNullValues(this.state.parameters || {} || {})}
        />
      </div>
    );
  }
}

function cleanEmptyOrNullValues(obj) {
  let result = {};
  for (let key of Object.keys(obj)) {
    if (obj[key] == null || obj[key] === '') continue;
    result[key] = obj[key];
  }
  return result;
}

export default createFragmentContainer(withStyles(styles)(RepositoryMetricsPage), {
  repository: graphql`
    fragment RepositoryMetricsPage_repository on Repository {
      id
      owner
      name
    }
  `,
});
