import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {withRouter} from 'react-router-dom'
import ReactMarkdown from 'react-markdown';

import {Table, TableBody, TableRow, TableRowColumn,} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RepositoryNameChip from "./chips/RepositoryNameChip";
import BuildBranchChip from "./chips/BuildBranchChip";
import BuildStatusChip from "./chips/BuildStatusChip";


class ViewerBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
      chip: {
        margin: 4,
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
              {edges.map(edge => this.buildItem(edge.node, styles))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  buildItem(build, styles) {
    return (
      <TableRow key={build.id}
                onMouseDown={() => this.handleBuildClick(build.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn style={{padding: 0}}>
          <RepositoryNameChip repository={build.repository} style={styles.chip}/>
          <BuildBranchChip build={build} style={styles.chip}/>
        </TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
          <ReactMarkdown source={build.changeMessageTitle}/>
        </TableRowColumn>
        <TableRowColumn style={{padding: 0}}>
          <BuildStatusChip build={build} style={styles.chip}/>
        </TableRowColumn>
      </TableRow>
    );
  }

  handleBuildClick(buildId) {
    this.context.router.history.push("/build/" + buildId)
  }

  handleRepositoryClick(repository) {
    this.context.router.history.push("/github/" + repository.owner + "/" + repository.name)
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
            changeMessageTitle
            status
            authorName
            changeTimestamp
            buildStartedTimestamp
            buildDurationInSeconds
            repository {
              owner
              name
            }
          }
        }
      }
    }
  `,
});
