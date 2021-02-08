import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/icons/Input';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { useHistory } from 'react-router-dom';
import { navigateBuild } from '../../utils/navigate';
import { BuildChangeChip_build } from './__generated__/BuildChangeChip_build.graphql';
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
  build: BuildChangeChip_build;
  className?: string;
}

function BuildChangeChip(props: Props) {
  let { build, className } = props;
  let history = useHistory();
  return (
    <Chip
      label={build.changeIdInRepo.substr(0, 6)}
      avatar={
        <Avatar className={props.classes.avatar}>
          <Input className={props.classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => navigateBuild(history, e, build.id)}
      className={className}
    />
  );
}

export default createFragmentContainer(withStyles(styles)(BuildChangeChip), {
  build: graphql`
    fragment BuildChangeChip_build on Build {
      id
      changeIdInRepo
    }
  `,
});
