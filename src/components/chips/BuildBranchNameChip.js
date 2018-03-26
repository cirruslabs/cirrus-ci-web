import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {cirrusColors} from "../../cirrusTheme";
import {withRouter} from "react-router-dom";
import {navigate} from "../../utils/navigate";
import {Icon, withStyles} from "material-ui";

class BuildBranchNameChip extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let build = this.props.build;
    return (
      <Chip className={this.props.className}
            label={build.branch}
            avatar={
              <Avatar style={{background: cirrusColors.cirrusPrimary}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>call_split</Icon>
              </Avatar>
            }
            onClick={(e) => this.handleBranchClick(e, build)}/>
    );
  }

  handleBranchClick(event, build) {
    if (build.repository) {
      navigate(this.context.router, event, "/github/" + build.repository.owner + "/" + build.repository.name + "/" + build.branch)
    } else if (build.repositoryId) {
      navigate(this.context.router, event, "/repository/" + build.repositoryId + "/" + build.branch)
    }
  }
}

export default withRouter(withStyles()(BuildBranchNameChip));
