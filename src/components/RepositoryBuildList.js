import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {Link, withRouter} from 'react-router-dom'

import {Table, TableBody, TableRow, TableRowColumn,} from 'material-ui/Table';
import ReactMarkdown from 'react-markdown';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import BuildDurationsChart from "./BuildDurationsChart";
import BuildBranchNameChip from "./chips/BuildBranchNameChip";
import BuildStatusChip from "./chips/BuildStatusChip";


class RepositoryBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object
  };


  constructor(props) {
    super();
    this.state = {selectedBuildId: "0"};
  }

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
      gap: {
        paddingTop: 16
      },
      chip: {
        margin: 4,
      },
      buildsChart: {
        height: 77,
      },
    };

    let builds = this.props.repository.builds.edges.map(edge => edge.node, styles);
    return (
      <div style={styles.main} className="container">
        <Paper zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.props.repository.owner + "/" + this.props.repository.name}/>
            </ToolbarGroup>
            <ToolbarGroup>
              <Link to={"/repository/" + this.props.repository.id + "/settings"}>
                <IconButton tooltip="Repository Settings">
                  <FontIcon className="material-icons">settings</FontIcon>
                </IconButton>
              </Link>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
        <Paper zDepth={1} rounded={false} style={styles.buildsChart}>
          <BuildDurationsChart builds={builds.slice().reverse()}
                               selectedBuildId={this.state.selectedBuildId}
                               onSelectBuildId={(buildId) => this.setState({selectedBuildId: buildId})}/>
        </Paper>
        <div style={styles.gap}/>
        <Paper zDepth={1} rounded={false}>
          <Table selectable={false} style={{tableLayout: 'auto'}}>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {builds.map(build => this.buildItem(build, styles))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  buildItem(build, styles) {
    let isSelectedBuild = this.state.selectedBuildId === build.id;
    return (
      <TableRow key={build.id}
                hovered={isSelectedBuild}
                onMouseOver={() => (!isSelectedBuild) && this.setState({selectedBuildId: build.id})}
                onMouseDown={() => this.handleBuildClick(build.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn>
          <BuildBranchNameChip build={build} style={styles.chip}/>
          <BuildStatusChip build={build} style={styles.chip}/>
        </TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
          <ReactMarkdown source={build.changeMessage}/>
        </TableRowColumn>
      </TableRow>
    );
  }

  handleBuildClick(buildId) {
    this.context.router.history.push("/build/" + buildId)
  }
}

export default createFragmentContainer(withRouter(RepositoryBuildList), {
  repository: graphql`
    fragment RepositoryBuildList_repository on Repository {
      id
      owner
      name
      builds(last: 100, branch: $branch) {
        edges {
          node {
            id
            branch
            changeIdInRepo
            changeMessage
            status
            authorName
            changeTimestamp
            repository {
              id
              owner
              name              
            }
          }
        }
      }
    }
  `,
});
