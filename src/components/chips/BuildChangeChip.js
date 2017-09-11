import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {cirrusColors} from "../../cirrusTheme";
import {withRouter} from "react-router-dom";

class BuildChangeChip extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let build = this.props.build;
    return (
      <Chip onClick={() => this.handleBranchClick(build)}
            style={this.props.style}>
        <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                icon={<FontIcon className="material-icons">input</FontIcon>}/>
        {build.changeIdInRepo.substr(0, 6)}
      </Chip>
    );
  }

  handleBranchClick(build) {
    this.context.router.history.push("/build/" + build.id);
  }
}

export default withRouter(BuildChangeChip);
