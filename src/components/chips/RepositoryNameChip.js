import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {cirrusColors} from "../../cirrusTheme";
import {withRouter} from "react-router-dom";
import {navigate} from "../../utils/navigate";
import {Icon} from "material-ui";

class RepositoryNameChip extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let repository = this.props.repository;
    return (
      <Chip label={repository.owner + "/" + repository.name}
            avatar={
              <Avatar style={{background: cirrusColors.cirrusPrimary}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>storage</Icon>
              </Avatar>
            }
            onClick={(e) => this.handleRepositoryClick(e, repository)}
            className={this.props.className}/>
    );
  }

  handleRepositoryClick(event, repository) {
    navigate(this.context.router, event, "/github/" + repository.owner + "/" + repository.name)
  }
}

export default withRouter(RepositoryNameChip);
