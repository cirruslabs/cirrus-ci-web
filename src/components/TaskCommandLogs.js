import React from 'react';
import Logs from "./logs/Logs";
import {QueryRenderer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';
import environment from "../createRelayEnvironment";
import CirrusLinearProgress from "./CirrusLinearProgress";
import {subscribeTaskCommandLogs} from "../rtu/ConnectionManager";
import CirrusCircularProgress from "./CirrusCircularProgress";
import {isTaskCommandFinalStatus} from "../utils/status";
import {Tooltip, withStyles} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import {withRouter} from "react-router-dom";

function logURL(taskId, command) {
  return "https://api.cirrus-ci.com/v1/task/" + taskId + "/logs/" + command.name + ".log";
}

let styles = theme => ({
  actionButtons: {
    position: 'absolute',
    right: 0,
  },
  downloadButton: {
    margin: theme.spacing(1.0)
  },
});

class TaskCommandRealTimeLogs extends React.Component {
  constructor(props) {
    super(props);
    this.subscriptionClosable = null;
    this.state = {
      realTimeLogs: !isTaskCommandFinalStatus(props.command.status),
      additionalLogs: "\n"
    };
  }

  componentDidMount() {
    if (!this.state.realTimeLogs) return;
    this.subscriptionClosable = subscribeTaskCommandLogs(this.props.taskId, this.props.command.name, (newLogs) => {
      this.setState(prevState => ({
        ...prevState,
        additionalLogs: prevState.additionalLogs + newLogs
      }));
    });
  }

  componentWillUnmount() {
    if (this.subscriptionClosable) {
      this.subscriptionClosable()
    }
  }

  render() {
    let {classes, taskId, command, initialLogLines} = this.props;
    let inProgress = !isTaskCommandFinalStatus(command.status);
    let downloadButton = <div className={classes.actionButtons}>
      <Fab variant="contained"
           className={classes.downloadButton}
           href={logURL(taskId, command)}
           target="_blank"
           rel="noopener noreferrer"
      >
        <Tooltip title="Download Full Logs">
          <Icon>get_app</Icon>
        </Tooltip>
      </Fab>
    </div>;
    return (
      <div style={{width: "100%", height: "100%"}}>
        {inProgress ? null : downloadButton}
        <Logs taskId={taskId} commandName={command.name} logs={initialLogLines.join("\n") + this.state.additionalLogs}/>
        {inProgress ? <CirrusLinearProgress/> : null}
      </div>
    );
  }
}

class TaskCommandLogs extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        variables={{taskId: this.props.taskId, commandName: this.props.command.name}}
        query={
          graphql`
        query TaskCommandLogsTailQuery($taskId: ID!, $commandName: String!) {
          task(id: $taskId) {
            commandLogsTail(name: $commandName)
          }
        }
      `
        }

        render={({error, props}) => {
          if (!props) {
            return (
              <div style={{width: "100%", minHeight: 100}}>
                <div className="text-center">
                  <CirrusCircularProgress/>
                </div>
              </div>
            );
          }
          return <TaskCommandRealTimeLogs initialLogLines={props.task.commandLogsTail || []} {...this.props}/>
        }}
      />);
  }
}

export default withRouter(withStyles(styles)(TaskCommandLogs))
