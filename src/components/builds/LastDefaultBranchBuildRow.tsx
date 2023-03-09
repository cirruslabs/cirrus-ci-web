import React, { useEffect } from 'react';
import { useFragment, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { navigateRepositoryHelper } from '../../utils/navigateHelper';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import classNames from 'classnames';
import BuildChangeChip from '../chips/BuildChangeChip';
import { LastDefaultBranchBuildRow_repository$key } from './__generated__/LastDefaultBranchBuildRow_repository.graphql';
import MarkdownTypography from '../common/MarkdownTypography';

const buildSubscription = graphql`
  subscription LastDefaultBranchBuildRowSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...LastDefaultBranchBuildRow_repository
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
    chip: {
      margin: 4,
    },
    message: {
      margin: theme.spacing(1.0),
      width: '100%',
    },
    cell: {
      padding: 4,
    },
  };
});

interface Props {
  repository: LastDefaultBranchBuildRow_repository$key;
}

export default function LastDefaultBranchBuildRow(props: Props) {
  let repository = useFragment(
    graphql`
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
    props.repository,
  );

  useEffect(() => {
    let variables = { repositoryID: repository.id };

    let subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [repository.id]);

  let navigate = useNavigate();
  let classes = useStyles();
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: '4px' }}>
          <RepositoryNameChip repository={repository} className={classes.chip} />
          <BuildChangeChip build={repository.lastDefaultBranchBuild} className={classes.chip} />
        </div>
        <MarkdownTypography
          text={build.changeMessageTitle}
          variant="body1"
          color="inherit"
          className={classes.message}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        />
      </TableCell>
      <TableCell className={classNames(classes.cell, classes.message)}>
        <MarkdownTypography text={build.changeMessageTitle} variant="body1" color="inherit" />
      </TableCell>
      <TableCell className={classes.cell}>
        <BuildStatusChip build={build} className={classNames('pull-right', classes.chip)} />
      </TableCell>
    </TableRow>
  );
}
