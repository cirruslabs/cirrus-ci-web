import React, { useEffect } from 'react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { useNavigate } from 'react-router-dom';
import { navigateRepositoryHelper } from '../../utils/navigateHelper';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import classNames from 'classnames';
import BuildChangeChip from '../chips/BuildChangeChip';
import { LastDefaultBranchBuildRow_repository } from './__generated__/LastDefaultBranchBuildRow_repository.graphql';
import { CommitTitle } from '../common/CommitMessage';

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
      onClick={e => navigateRepositoryHelper(navigate, e, repository.owner, repository.name)}
      hover={true}
      style={{ cursor: 'pointer' }}
    >
      <TableCell className={classes.cell}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <RepositoryNameChip repository={repository} className={classes.chip} />
          <BuildChangeChip build={repository.lastDefaultBranchBuild} className={classes.chip} />
        </div>
        <CommitTitle
          changeMessageTitle={build.changeMessageTitle}
          typographyProps={{
            variant: 'body1',
            color: 'inherit',
            className: classes.message,
            sx: { display: { xs: 'block', sm: 'none' } },
          }}
        />
      </TableCell>
      <TableCell className={classNames(classes.cell, classes.message)}>
        <CommitTitle
          changeMessageTitle={build.changeMessageTitle}
          typographyProps={{
            variant: 'body1',
            color: 'inherit',
          }}
        />
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
        ...BuildChangeChip_build
        ...BuildStatusChip_build
      }
      ...RepositoryNameChip_repository
    }
  `,
});
