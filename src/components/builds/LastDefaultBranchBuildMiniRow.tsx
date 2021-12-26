import React, { useEffect } from 'react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import Typography from '@mui/material/Typography';
import { LastDefaultBranchBuildMiniRow_repository } from './__generated__/LastDefaultBranchBuildMiniRow_repository.graphql';
import { useNavigate } from 'react-router-dom';
import { CommitTitle } from '../common/CommitMessage';

const buildSubscription = graphql`
  subscription LastDefaultBranchBuildMiniRowSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...LastDefaultBranchBuildMiniRow_repository
    }
  }
`;

const styles = theme =>
  createStyles({
    chip: {
      margin: theme.spacing(1.0),
    },
    message: {
      margin: theme.spacing(1.0),
      width: '100%',
    },
  });

interface Props extends WithStyles<typeof styles> {
  repository: LastDefaultBranchBuildMiniRow_repository;
}

function LastDefaultBranchBuildRow(props: Props) {
  useEffect(() => {
    let variables = { repositoryID: props.repository.id };

    const subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [props.repository.id]);

  let navigate = useNavigate();

  let { classes, repository } = props;
  let build = repository.lastDefaultBranchBuild;
  if (!build) {
    return null;
  }
  return (
    <TableRow
      key={repository.id}
      onClick={e => navigateBuildHelper(navigate, e, build.id)}
      hover={true}
      style={{ cursor: 'pointer' }}
    >
      <TableCell style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <RepositoryNameChip repository={repository} fullName={true} className={classes.chip} />
          <BuildStatusChip build={build} mini={true} className={classes.chip} />
        </div>
        <div className={classes.message}>
          <Typography variant="body1" color="inherit">
            <CommitTitle changeMessageTitle={build.changeMessageTitle} />
          </Typography>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default createFragmentContainer(withStyles(styles)(LastDefaultBranchBuildRow), {
  repository: graphql`
    fragment LastDefaultBranchBuildMiniRow_repository on Repository {
      id
      lastDefaultBranchBuild {
        id
        changeMessageTitle
        ...BuildStatusChip_build
      }
      ...RepositoryNameChip_repository
    }
  `,
});
