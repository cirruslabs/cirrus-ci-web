import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import AccessTime from '@mui/icons-material/AccessTime';
import Tooltip from '@mui/material/Tooltip';
import {graphql} from 'babel-plugin-relay/macro';
import React from 'react';
import {createFragmentContainer} from 'react-relay';
import {NextCronInvocationTimeChip_settings} from './__generated__/NextCronInvocationTimeChip_settings.graphql';
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
  settings: NextCronInvocationTimeChip_settings;
  className?: string;
}

function NextCronInvocationTimeChip(props: Props) {
  let classes = useStyles();
  let nextInvocationTimestamp = props.settings.nextInvocationTimestamp;
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

export default createFragmentContainer(NextCronInvocationTimeChip, {
  settings: graphql`
    fragment NextCronInvocationTimeChip_settings on RepositoryCronSettings {
      nextInvocationTimestamp
    }
  `,
});
