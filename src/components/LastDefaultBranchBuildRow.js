import React from 'react';
import {createFragmentContainer, graphql, requestSubscription} from "react-relay";
import environment from "../createRelayEnvironment";
import {TableCell, TableRow, Typography, withStyles} from "material-ui";
import {withRouter} from "react-router-dom";
import {navigateBuild} from "../utils/navigate";
import RepositoryNameChip from "./chips/RepositoryNameChip";
import BuildStatusChip from "./chips/BuildStatusChip";

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
    margin: theme.spacing.unit,
  },
  message: {
    margin: theme.spacing.unit,
  },
});

class LastDefaultBranchBuildRow extends React.Component {
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
      return <div/>;
    }
    return (
      <TableRow key={build.id}
                onClick={(e) => navigateBuild(this.context.router, e, build.id)}
                hover={true}
                style={{cursor: "pointer"}}>
        <TableCell style={{padding: 0}}>
          <div className="d-flex justify-content-between">
            <RepositoryNameChip repository={repository} className={classes.chip}/>
            <BuildStatusChip build={build} className={classes.chip}/>
          </div>
          <Typography className={classes.chip}
                      variant="subheading"
          >
            {build.changeMessageTitle}
          </Typography>
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
