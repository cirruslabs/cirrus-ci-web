import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {cirrusColors} from "../../cirrusTheme";
import {withRouter} from "react-router-dom";

class RepositoryNameChip extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let repository = this.props.repository;
    return (
      <Chip onClick={() => this.handleRepositoryClick(repository)}
            style={this.props.style}>
        <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                icon={<FontIcon className="material-icons">storage</FontIcon>}/>
        {repository.owner + "/" + repository.name}
      </Chip>
    );
  }

  handleRepositoryClick(repository) {
    this.context.router.history.push("/github/" + repository.owner + "/" + repository.name)
  }
}

export default withRouter(RepositoryNameChip);
