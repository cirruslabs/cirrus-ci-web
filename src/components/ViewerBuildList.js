import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import {withRouter} from 'react-router-dom'

import BuildStatus from './BuildStatus'

import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';


class ViewerBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
    };

    let edges = this.props.viewer.builds.edges;
    return (
      <div style={styles.main} className="container">
        <Paper zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="Recent Builds"/>
            </ToolbarGroup>
          </Toolbar>
          <Table selectable={false} style={{tableLayout: 'auto'}}>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {edges.map(edge => this.buildItem(edge.node))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  buildItem(build) {
    return (
      <TableRow key={build.id}
                onMouseDown={() => this.handleBuildClick(build.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn>
          <BuildStatus status={build.status}/>
        </TableRowColumn>
        <TableRowColumn>
          {build.changeIdInRepo.substr(0, 6)}
        </TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>{build.changeMessage}</TableRowColumn>
      </TableRow>
    );
  }

  handleBuildClick(buildId) {
    this.context.router.history.push("/build/" + buildId)
  }
}

export default createFragmentContainer(withRouter(ViewerBuildList), {
  viewer: graphql`
    fragment ViewerBuildList_viewer on User {
      builds(last: 100) {
        edges {
          node {
            id
            branch
            changeIdInRepo
            changeMessage
            status
            authorName
            changeTimestamp
            buildStartedTimestamp
            buildFinishedTimestamp
          }
        }
      }
    }
  `,
});
