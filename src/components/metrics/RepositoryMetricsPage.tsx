import {graphql} from 'babel-plugin-relay/macro';
import React, {useState} from 'react';
import {createFragmentContainer} from 'react-relay';
import {makeStyles} from '@mui/styles';
import RepositoryMetricsCharts from './RepositoryMetricsCharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {RepositoryMetricsPage_repository} from './__generated__/RepositoryMetricsPage_repository.graphql';
import {MetricsQueryParameters} from './__generated__/RepositoryMetricsChartsQuery.graphql';
import {Helmet as Head} from 'react-helmet';

const useStyles = makeStyles(theme => {
  return {
    title: { 'text-align': 'center' },
    settingGap: {
      paddingTop: 16,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 180,
    },
  };
});

interface Props {
  repository: RepositoryMetricsPage_repository;
}

function RepositoryMetricsPage(props: Props) {
  let [parameters, setParameters] = useState<MetricsQueryParameters>({});
  let { repository } = props;
  let classes = useStyles();

  function handleChange(event) {
    setParameters({
      ...parameters,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div>
      <Head>
        <title>
          {repository.owner}/{repository.name}'s Metrics - Cirrus CI
        </title>
      </Head>
      <Card elevation={24}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
            Metrics for repository: {repository.name}
          </Typography>
          <Grid container direction="row" justifyContent="center">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="type-helper">Instance Type</InputLabel>
              <Select
                value={parameters.type || ''}
                onChange={event => handleChange(event)}
                input={<Input name="type" id="type-helper" />}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={'container'}>Linux Container</MenuItem>
                <MenuItem value={'windows_container'}>Windows Container</MenuItem>
                <MenuItem value={'macos_instance'}>macOS VM</MenuItem>
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
                value={parameters.status || ''}
                onChange={event => handleChange(event)}
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
                value={parameters.isPR || ''}
                onChange={event => handleChange(event)}
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
                value={parameters.usedComputeCredits || ''}
                onChange={event => handleChange(event)}
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
      <div className={classes.settingGap} />
      <RepositoryMetricsCharts repositoryId={repository.id} parameters={cleanEmptyOrNullValues(parameters)} />
    </div>
  );
}

function cleanEmptyOrNullValues(obj) {
  let result = {};
  for (let key of Object.keys(obj)) {
    if (obj[key] == null || obj[key] === '') continue;
    result[key] = obj[key];
  }
  return result;
}

export default createFragmentContainer(RepositoryMetricsPage, {
  repository: graphql`
    fragment RepositoryMetricsPage_repository on Repository {
      id
      owner
      name
    }
  `,
});
