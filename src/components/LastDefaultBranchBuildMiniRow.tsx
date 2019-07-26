import React from 'react';
import { createFragmentContainer, requestSubscription, Disposable } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../createRelayEnvironment';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, createStyles, WithStyles } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { navigateBuild } from '../utils/navigate';
import RepositoryNameChip from './chips/RepositoryNameChip';
import BuildStatusChip from './chips/BuildStatusChip';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { LastDefaultBranchBuildMiniRow_repository } from './__generated__/LastDefaultBranchBuildMiniRow_repository.graphql';

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

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  repository: LastDefaultBranchBuildMiniRow_repository;
}

class LastDefaultBranchBuildRow extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  subscription: Disposable;

  componentDidMount() {
    let variables = { repositoryID: this.props.repository.id };

    this.subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
  }

  componentWillUnmount() {
    this.closeSubscription();
  }

  closeSubscription() {
    this.subscription && this.subscription.dispose && this.subscription.dispose();
  }

  render() {
    let { classes, repository } = this.props;
    let build = repository.lastDefaultBranchBuild;
    if (!build) {
      return null;
    }
    return (
      <TableRow
        key={repository.id}
        onClick={e => navigateBuild(this.context.router, e, build.id)}
        hover={true}
        style={{ cursor: 'pointer' }}
      >
        <TableCell style={{ padding: 0 }}>
          <div className="d-flex justify-content-between">
            <RepositoryNameChip repository={repository as any} className={classes.chip} />
            <BuildStatusChip build={build as any} mini={true} className={classes.chip} />
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
}

export default createFragmentContainer(withRouter(withStyles(styles)(LastDefaultBranchBuildRow)), {
  repository: graphql`
    fragment LastDefaultBranchBuildMiniRow_repository on Repository {
      id
      owner
      name
      lastDefaultBranchBuild {
        id
        branch
        changeIdInRepo
        changeMessageTitle
        durationInSeconds
        status
        changeTimestamp
      }
    }
  `,
});
