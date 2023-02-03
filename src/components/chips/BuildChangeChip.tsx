import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Input from '@mui/icons-material/Input';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { BuildChangeChip_build$key } from './__generated__/BuildChangeChip_build.graphql';
import { makeStyles } from '@mui/styles';

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
  build: BuildChangeChip_build$key;
  className?: string;
}

export default function BuildChangeChip(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildChangeChip_build on Build {
        id
        changeIdInRepo
      }
    `,
    props.build,
  );

  let { className } = props;
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
