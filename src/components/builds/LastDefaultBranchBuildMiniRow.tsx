import React, { useEffect } from 'react';
import { useFragment, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import { LastDefaultBranchBuildMiniRow_repository$key } from './__generated__/LastDefaultBranchBuildMiniRow_repository.graphql';
import { useNavigate } from 'react-router-dom';
import MarkdownTypography from '../common/MarkdownTypography';

const buildSubscription = graphql`
  subscription LastDefaultBranchBuildMiniRowSubscription($repositoryID: ID!) {
    repository(id: $repositoryID) {
      ...LastDefaultBranchBuildMiniRow_repository
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
    chip: {
      margin: theme.spacing(1.0),
    },
    message: {
      margin: theme.spacing(1.0),
      width: '100%',
    },
  };
});

interface Props {
  repository: LastDefaultBranchBuildMiniRow_repository$key;
}

export default function LastDefaultBranchBuildRow(props: Props) {
  let repository = useFragment(
    graphql`
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
    props.repository,
  );

  useEffect(() => {
    let variables = { repositoryID: repository.id };

    const subscription = requestSubscription(environment, {
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
          <MarkdownTypography text={build.changeMessageTitle} variant="body1" color="inherit" />
        </div>
      </TableCell>
    </TableRow>
  );
}
