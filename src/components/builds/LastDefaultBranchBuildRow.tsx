import React, { useEffect } from 'react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useHistory, withRouter } from 'react-router-dom';
import { navigateRepository } from '../../utils/navigate';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import classNames from 'classnames';
import BuildChangeChip from '../chips/BuildChangeChip';
import Typography from '@material-ui/core/Typography';
import { LastDefaultBranchBuildRow_repository } from './__generated__/LastDefaultBranchBuildRow_repository.graphql';

const buildSubscription = graphql`
  subscription LastDefaultBranchBuildRowSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...LastDefaultBranchBuildRow_repository
    }
  }
`;

const styles = theme => ({
  chip: {
    margin: 4,
  },
  message: {
    margin: theme.spacing(1.0),
    width: '100%',
  },
  cell: {
    padding: 0,
  },
});

interface Props extends WithStyles<typeof styles> {
  repository: LastDefaultBranchBuildRow_repository;
}

function LastDefaultBranchBuildRow(props: Props) {
  useEffect(() => {
    let variables = { repositoryID: props.repository.id };

    let subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, []);

  let history = useHistory();
  let { classes, repository } = props;
  let build = repository.lastDefaultBranchBuild;
  if (!build) {
    return null;
  }
  return (
    <TableRow
      key={repository.id}
      onClick={e => navigateRepository(history, e, repository.owner, repository.name)}
      hover={true}
      style={{ cursor: 'pointer' }}
    >
      <TableCell className={classes.cell}>
        <div className="d-flex flex-column align-items-start">
          <RepositoryNameChip repository={repository} className={classes.chip} />
          <BuildChangeChip build={repository.lastDefaultBranchBuild} className={classes.chip} />
        </div>
        <div className={classNames('d-lg-none', classes.message)}>
          <Typography variant="body1" color="inherit">
            {build.changeMessageTitle}
          </Typography>
        </div>
      </TableCell>
      <TableCell className={classNames(classes.cell, classes.message)}>
        <div className="card-body">
          <Typography variant="body1" color="inherit">
            {build.changeMessageTitle}
          </Typography>
        </div>
      </TableCell>
      <TableCell className={classes.cell}>
        <BuildStatusChip build={build} className={classNames('pull-right', classes.chip)} />
      </TableCell>
    </TableRow>
  );
}

export default createFragmentContainer(withStyles(styles)(LastDefaultBranchBuildRow), {
  repository: graphql`
    fragment LastDefaultBranchBuildRow_repository on Repository {
      id
      owner
      name
      lastDefaultBranchBuild {
        id
        branch
        changeMessageTitle
        status
        ...BuildChangeChip_build
        ...BuildStatusChip_build
      }
      ...RepositoryNameChip_repository
    }
  `,
});
