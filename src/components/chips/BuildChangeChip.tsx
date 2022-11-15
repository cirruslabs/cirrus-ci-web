import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Input from '@mui/icons-material/Input';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { BuildChangeChip_build } from './__generated__/BuildChangeChip_build.graphql';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';

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
  let navigate = useNavigate();
  return (
    <Chip
      label={build.changeIdInRepo.substr(0, 7)}
      avatar={
        <Avatar className={props.classes.avatar}>
          <Input className={props.classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => navigateBuildHelper(navigate, e, build.id)}
      onAuxClick={e => navigateBuildHelper(navigate, e, build.id)}
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
