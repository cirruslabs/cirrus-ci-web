import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Input from '@mui/icons-material/Input';
import {graphql} from 'babel-plugin-relay/macro';
import React from 'react';
import {createFragmentContainer} from 'react-relay';
import {useNavigate} from 'react-router-dom';
import {navigateBuildHelper} from '../../utils/navigateHelper';
import {BuildChangeChip_build} from './__generated__/BuildChangeChip_build.graphql';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(theme => {
  return {
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
  };
});

interface Props {
  build: BuildChangeChip_build;
  className?: string;
}

function BuildChangeChip(props: Props) {
  let { build, className } = props;
  let navigate = useNavigate();
  let classes = useStyles();
  return (
    <Chip
      label={build.changeIdInRepo.substr(0, 7)}
      avatar={
        <Avatar className={classes.avatar}>
          <Input className={classes.avatarIcon} />
        </Avatar>
      }
      onClick={e => navigateBuildHelper(navigate, e, build.id)}
      onAuxClick={e => navigateBuildHelper(navigate, e, build.id)}
      className={className}
    />
  );
}

export default createFragmentContainer(BuildChangeChip, {
  build: graphql`
    fragment BuildChangeChip_build on Build {
      id
      changeIdInRepo
    }
  `,
});
