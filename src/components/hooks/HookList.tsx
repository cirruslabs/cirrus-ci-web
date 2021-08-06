import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import HookListRow from './HookListRow';
import { FragmentRefs } from 'relay-runtime';
import { Card, CardContent, createStyles, Theme, Typography } from '@material-ui/core';
import { HookType } from './HookType';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    pre: {
      color: theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
      background: theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
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
              Simply add the <code>SLACK_WEBHOOK_URL</code> variable in the repository settings and create a{' '}
              <code>.cirrus.star</code> with the snippet above in your repository's root directory.
            </p>
            <p>Now, every time the {hookTypeName} fails, the hook will run and the results will be displayed here!</p>
            <p>
              Read more about hooks{' '}
              <a href="https://cirrus-ci.org/guide/programming-tasks/#hooks" target="_blank" rel="noopener noreferrer">
                in the official documentation
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
