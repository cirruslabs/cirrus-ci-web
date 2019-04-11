import React from 'react';
import {createFragmentContainer, graphql, requestSubscription} from "react-relay";
import environment from "../createRelayEnvironment";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {withStyles} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import {navigateRepository} from "../utils/navigate";
import RepositoryNameChip from "./chips/RepositoryNameChip";
import BuildStatusChip from "./chips/BuildStatusChip";
import classNames from "classnames";
import BuildChangeChip from "./chips/BuildChangeChip";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const buildSubscription = graphql`
  subscription LastDefaultBranchBuildRowSubscription(
    $repositoryID: ID!
  ) {
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
    margin: theme.spacing.unit,
    width: "100%",
  },
  cell: {
    padding: 0,
  },
});

class LastDefaultBranchBuildRow extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    let variables = {repositoryID: this.props.repository.id};

    this.subscription = requestSubscription(
      environment,
      {
        subscription: buildSubscription,
        variables: variables
      }
    );
  }

  componentWillUnmount() {
    this.closeSubscription();
  }

  closeSubscription() {
    this.subscription && this.subscription.dispose && this.subscription.dispose()
  }

  render() {
    let {classes, repository} = this.props;
    let build = repository.lastDefaultBranchBuild;
    if (!build) {
      return null;
    }
    return (
      <TableRow key={repository.id}
                onClick={(e) => navigateRepository(this.context.router, e, repository.owner, repository.name)}
                hover={true}
                style={{cursor: "pointer"}}>
        <TableCell className={classes.cell}>
          <div className="d-flex flex-column align-items-start">
            <RepositoryNameChip repository={repository} className={classes.chip}/>
            <BuildChangeChip build={build} className={classes.chip}/>
          </div>
          <div className={classNames("d-lg-none", classes.message)}>
            <Typography variant="h6" color="inherit">
              {{build.changeMessageTitle}}
            </Typography>
          </div>
        </TableCell>
        <TableCell className={classNames(classes.cell, classes.message)}>
          <div className="card-body">
            <Typography variant="h6" color="inherit">
              {{changeMessageTitle}}
            </Typography>
          </div>
        </TableCell>
        <TableCell className={classes.cell}>
          <BuildStatusChip build={build} className={classNames("pull-right", classes.chip)}/>
        </TableCell>
      </TableRow>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(LastDefaultBranchBuildRow)), {
  repository: graphql`
    fragment LastDefaultBranchBuildRow_repository on Repository {
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
