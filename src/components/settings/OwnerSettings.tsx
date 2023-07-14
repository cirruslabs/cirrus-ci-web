import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { Card, CardActions, CardContent } from '@mui/material';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import MarkdownTypography from 'components/common/MarkdownTypography';
import OwnerComputeCredits from 'components/compute-credits/OwnerComputeCredits';
import WebHookSettings from 'components/webhooks/WebHookSettings';

import MonthlyUsageChart from '../compute-credits/MonthlyUsageChart';
import OwnerApiSettings from './OwnerApiSettings';
import OwnerPersistentWorkerPools from './OwnerPersistentWorkerPools';
import OwnerSecuredVariables from './OwnerSecuredVariables';
import { OwnerSettings_info$key } from './__generated__/OwnerSettings_info.graphql';

const useStyles = makeStyles(theme => {
  return {
    title: {
      backgroundColor: theme.palette.action.disabledBackground,
    },
    settingGap: {
      paddingTop: 16,
    },
  };
});

interface Props {
  info: OwnerSettings_info$key | null;
}

export default function OwnerSettings(props: Props) {
  let info = useFragment(
    graphql`
      fragment OwnerSettings_info on OwnerInfo {
        platform
        uid
        name
        viewerPermission
        description {
          message
          actions {
            title
            link
          }
        }
        ...OwnerComputeCredits_info
        ...MonthlyUsageChart_info
        ...OwnerApiSettings_info
        ...OwnerSecuredVariables_info
        ...OwnerPersistentWorkerPools_info
        ...WebHookSettings_info
      }
    `,
    props.info,
  );

  let classes = useStyles();

  if (!info) {
    return <Typography variant="subtitle1">Can't find information this organization!</Typography>;
  }

  if (!info.viewerPermission || info.viewerPermission === 'NONE') {
    return <Typography variant="subtitle1">You do not have administrator access on this organization!</Typography>;
  }

  return (
    <div>
      <Paper elevation={16}>
        <Toolbar className={classes.title}>
          <Typography variant="h6" color="inherit">
            Settings for {info.name}
          </Typography>
        </Toolbar>
      </Paper>
      <div className={classes.settingGap} />
      <Card elevation={16}>
        <CardHeader title="GitHub Settings" />
        <CardContent>
          <MarkdownTypography text={info.description.message} />
        </CardContent>
        <CardActions>
          {info.description.actions.map(action => (
            <Button variant="contained" href={action.link}>
              {action.title}
            </Button>
          ))}
        </CardActions>
      </Card>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OwnerComputeCredits info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <MonthlyUsageChart info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OwnerSecuredVariables info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OwnerApiSettings info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OwnerPersistentWorkerPools info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <WebHookSettings info={info} />
      </Paper>
      <div className={classes.settingGap} />
    </div>
  );
}
