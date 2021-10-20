import React, { useEffect } from 'react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { navigateBuild } from '../../utils/navigate';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import Typography from '@material-ui/core/Typography';
import { LastDefaultBranchBuildMiniRow_repository } from './__generated__/LastDefaultBranchBuildMiniRow_repository.graphql';
import { useHistory } from 'react-router-dom';

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

  let history = useHistory();

  let { classes, repository } = props;
  let build = repository.lastDefaultBranchBuild;
  if (!build) {
    return null;
  }
  return (
    <TableRow
      key={repository.id}
      onClick={e => navigateBuild(history, e, build.id)}
      hover={true}
      style={{ cursor: 'pointer' }}
    >
      <TableCell style={{ padding: 0 }}>
        <div className="d-flex justify-content-between">
          <RepositoryNameChip repository={repository} fullName={true} className={classes.chip} />
          <BuildStatusChip build={build} mini={true} className={classes.chip} />
        </div>
        <div className={classes.message}>
          <Typography variant="body1" color="inherit">
            {build.changeMessageTitle}
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
