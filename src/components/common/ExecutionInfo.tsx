import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import { ExecutionInfo_info } from './__generated__/ExecutionInfo_info.graphql';

let styles = {
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  info: ExecutionInfo_info;
}

class ExecutionInfo extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { info, classes } = this.props;
    return (
      <div>
        {info.labels.map(label => {
          return <Chip key={label} className={classes.chip} label={label} />;
        })}
      </div>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(ExecutionInfo)), {
  info: graphql`
    fragment ExecutionInfo_info on ExecutionInfo {
      labels
    }
  `,
});
