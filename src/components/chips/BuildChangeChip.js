import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import {cirrusColors} from "../../cirrusTheme";
import {withRouter} from "react-router-dom";
import {navigateBuild} from "../../utils/navigate";

class BuildChangeChip extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let build = this.props.build;
    return (
      <Chip label={build.changeIdInRepo.substr(0, 6)}
            avatar={
              <Avatar style={{background: cirrusColors.cirrusPrimary}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>input</Icon>
              </Avatar>
            }
            onClick={(e) => navigateBuild(this.context.router, e, build.id)}
            className={this.props.className}/>
    );
  }
}

export default withRouter(BuildChangeChip);
