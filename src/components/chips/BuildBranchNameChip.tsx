import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CallSplit from '@material-ui/icons/CallSplit';
import { useHistory } from 'react-router-dom';
import { navigate } from '../../utils/navigate';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { BuildBranchNameChip_build } from './__generated__/BuildBranchNameChip_build.graphql';
import { shorten } from '../../utils/text';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = theme =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {
  className?: string;
  build: BuildBranchNameChip_build;
}

function BuildBranchNameChip(props: Props) {
  let history = useHistory();
  let build = props.build;

  function handleBranchClick(event) {
    if (build.repository) {
      navigate(history, event, '/github/' + build.repository.owner + '/' + build.repository.name + '/' + build.branch);
    } else if (build.repository.id) {
      navigate(history, event, '/repository/' + build.repository.id + '/' + build.branch);
    }
  }

  return (
    <Chip
      className={props.className}
      label={shorten(build.branch)}
      avatar={
        <Avatar className={props.classes.avatar}>
          <CallSplit className={props.classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => handleBranchClick(e)}
    />
  );
}

export default createFragmentContainer(withStyles(styles)(BuildBranchNameChip), {
  build: graphql`
    fragment BuildBranchNameChip_build on Build {
      id
      branch
      repository {
        id
        owner
        name
      }
    }
  `,
});
