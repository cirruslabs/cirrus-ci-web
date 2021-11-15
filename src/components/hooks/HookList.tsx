import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import HookListRow from './HookListRow';
import { FragmentRefs } from 'relay-runtime';
import { Card, CardContent, Theme, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { HookType } from './HookType';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';

const styles = (theme: Theme) =>
  createStyles({
    pre: {
      color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
      background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
      padding: theme.spacing(0.5),
    },
  });

interface Hook {
  readonly timestamp: number;
  readonly ' $fragmentRefs': FragmentRefs<'HookListRow_hook'>;
}

interface Props extends WithStyles<typeof styles> {
  hooks: ReadonlyArray<Hook>;
  type: HookType;
}

function HooksList(props: Props) {
  let { hooks, type, classes } = props;

  if (hooks.length === 0) {
    const hookExampleTemplate = `load("cirrus", "env", "http")

def on_ENTITY_failed(ctx):
    url = env.get("SLACK_WEBHOOK_URL")
    if not url:
        return

    message = {
        "text": "https://cirrus-ci.com/ENTITY/{} failed!".format(ctx.payload.data.ENTITY.id)
    }

    http.post(url, json_body=message)`;
    const hookExample =
      type === HookType.Build
        ? hookExampleTemplate.replaceAll('ENTITY', 'build')
        : hookExampleTemplate.replaceAll('ENTITY', 'task');
    const hookTypeName = HookType[type].toLowerCase();

    return (
      <Card>
        <CardContent>
          <Typography variant="body1">
            <p>Doesn't seem like you've defined any hooks.</p>
            <p>
              Here's an example of how you can receive notifications about failed {hookTypeName}s to your Slack channel
              using{' '}
              <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer">
                Incoming Webhooks
              </a>
              :
            </p>
            <pre className={classes.pre}>
              <code>{hookExample}</code>
            </pre>
            <p>
              Just add the <code>SLACK_WEBHOOK_URL</code> variable in the repository settings and create a{' '}
              <code>.cirrus.star</code> with the snippet above in your repository's root directory.
            </p>
            <p>Now, every time the {hookTypeName} fails, the hook will run and the results will be displayed here!</p>
            <p>
              Additional documentation about hooks can be found{' '}
              <a href="https://cirrus-ci.org/guide/programming-tasks/#hooks" target="_blank" rel="noopener noreferrer">
                here
              </a>
              .
            </p>
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const sortedHooks = hooks.slice().sort(function (a, b) {
    return b.timestamp - a.timestamp;
  });

  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {sortedHooks.map(hook => (
          <HookListRow hook={hook} />
        ))}
      </TableBody>
    </Table>
  );
}

export default withStyles(styles)(HooksList);
