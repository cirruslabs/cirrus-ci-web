import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import AccessTime from '@mui/icons-material/AccessTime';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';

import { NextCronInvocationTimeChip_settings$key } from './__generated__/NextCronInvocationTimeChip_settings.graphql';

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
  settings: NextCronInvocationTimeChip_settings$key;
  className?: string;
}

export default function NextCronInvocationTimeChip(props: Props) {
  let settings = useFragment(
    graphql`
      fragment NextCronInvocationTimeChip_settings on RepositoryCronSettings {
        nextInvocationTimestamp
      }
    `,
    props.settings,
  );

  let classes = useStyles();
  let nextInvocationTimestamp = settings.nextInvocationTimestamp;
  return (
    <Tooltip
      title={`Next invocation will be at ${new Date(nextInvocationTimestamp).toLocaleTimeString()} on ${new Date(
        nextInvocationTimestamp,
      ).toDateString()}`}
    >
      <Chip
        className={props.className}
        label={`Next invocation: ${new Date(nextInvocationTimestamp).toLocaleTimeString()}`}
        avatar={
          <Avatar className={classes.avatar}>
            <AccessTime className={classes.avatarIcon} />
          </Avatar>
        }
      />
    </Tooltip>
  );
}
