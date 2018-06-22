import React from 'react';
import {createFragmentContainer, graphql, requestSubscription} from "react-relay";
import environment from "../createRelayEnvironment";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {withStyles} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import {navigateBuild} from "../utils/navigate";
import RepositoryNameChip from "./chips/RepositoryNameChip";
import ReactMarkdown from 'react-markdown';
import BuildStatusChip from "./chips/BuildStatusChip";
import PropTypes from "prop-types";

const buildSubscription = graphql`
  subscription LastDefaultBranchBuildMiniRowSubscription(
    $repositoryID: ID!
  ) {
    repository(id: $repositoryID) {      
      ...LastDefaultBranchBuildMiniRow_repository
    }
  }
`;

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
  message: {
    margin: theme.spacing.unit,
    width: "100%",
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
                onClick={(e) => navigateBuild(this.context.router, e, build.id)}
                hover={true}
                style={{cursor: "pointer"}}>
        <TableCell style={{padding: 0}}>
          <div className="d-flex justify-content-between">
            <RepositoryNameChip repository={repository} className={classes.chip}/>
            <BuildStatusChip build={build} mini={true} className={classes.chip}/>
          </div>
          <div className={classes.message}>
            <ReactMarkdown source={build.changeMessageTitle}/>
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
