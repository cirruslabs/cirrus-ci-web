import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {Link, withRouter} from 'react-router-dom'

import {Table, TableBody, TableRow, TableRowColumn,} from 'material-ui/Table';
import ReactMarkdown from 'react-markdown';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {cirrusColors} from "../cirrusTheme";
import {buildStatusColor} from "../utils/colors";
import {buildStatusIconName, buildStatusMessage} from "../utils/status";
import BuildDurationsChart from "./BuildDurationsChart";


class RepositoryBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object
  };

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
              <Link to={ "/repository/" + this.props.repository.id + "/settings"}>
                <IconButton tooltip="Repository Settings">
                  <FontIcon className="material-icons">settings</FontIcon>
                </IconButton>
              </Link>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
        <Paper zDepth={1} rounded={false} style={styles.buildsChart}>
          <BuildDurationsChart builds={builds.slice().reverse()}/>
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
    return (
      <TableRow key={build.id}
                onMouseDown={() => this.handleBuildClick(build.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                    icon={<FontIcon className="material-icons">call_split</FontIcon>} />
            {build.branch}#{build.changeIdInRepo.substr(0, 6)}
          </Chip>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={buildStatusColor(build.status)}
                    icon={<FontIcon className="material-icons">{buildStatusIconName(build.status)}</FontIcon>} />
            {buildStatusMessage(build)}
          </Chip>
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
            buildDurationInSeconds
          }
        }
      }
    }
  `,
});
