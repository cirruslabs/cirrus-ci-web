import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {cirrusColors} from "../../cirrusTheme";
import {withRouter} from "react-router-dom";
import {navigate} from "../../utils/navigate";

class BuildBranchNameChip extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let build = this.props.build;
    return (
      <Chip onClick={(e) => this.handleBranchClick(e, build)}
            style={this.props.style}>
        <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                icon={<FontIcon className="material-icons">call_split</FontIcon>}/>
        {build.branch}
      </Chip>
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

export default withRouter(BuildBranchNameChip);
