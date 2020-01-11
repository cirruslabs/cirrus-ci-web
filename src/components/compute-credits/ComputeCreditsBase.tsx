import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import Card from '@material-ui/core/Card/Card';
import CardActions from '@material-ui/core/CardActions/CardActions';
import CardContent from '@material-ui/core/CardContent/CardContent';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import Collapse from '@material-ui/core/Collapse/Collapse';
import { orange } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createStyles, WithStyles } from '@material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BillingSettingsButton from './BillingSettingsButton';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import ComputeCreditsBuyDialog from './ComputeCreditsBuyDialog';
import { ComputeCreditsBase_info } from './__generated__/ComputeCreditsBase_info.graphql';

const styles = theme =>
  createStyles({
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    gap: {
      paddingTop: 16,
    },
    modal: {
      top: '25%',
      margin: 'auto',
      position: 'absolute',
      width: theme.spacing(50.0),
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4.0),
    },
    credits: {
      color: orange[700],
      '&:hover': {
        color: orange[900],
      },
    },
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  transactionsComponent: JSX.Element;
  info?: ComputeCreditsBase_info;
  balanceInCredits?: string;
  accountId: number;
}

interface State {
  expanded: boolean;
}

class ComputeCreditsBase extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = { expanded: false, openBuyCredits: false };

  handleExpandClick = () => {
    this.setState(prevState => ({
      ...prevState,
      expanded: !prevState.expanded,
    }));
  };

  handleOpenBuyCredits = () => {
    this.setState(prevState => ({
      ...prevState,
      openBuyCredits: true,
    }));
  };

  handleCloseBuyCredits = () => {
    this.setState(prevState => ({
      ...prevState,
      openBuyCredits: false,
    }));
  };

  render() {
    let { classes } = this.props;

    return (
      <Card>
        <CardHeader title="Compute Credits" />
        <CardContent>
          <Typography variant="h6">
            Your current compute credits balance:{' '}
            <b className={classes.credits}>{this.props.balanceInCredits || '0.00'}</b>
          </Typography>
          <div className={classes.gap} />
          <Typography variant="subtitle1">
            <p>
              Compute credits are used for buying <b>priority</b> CPU time on Community Clusters for your private or
              public projects. It allows not to bother about configuring{' '}
              <a href="https://cirrus-ci.org/guide/supported-computing-services/">Compute Services</a> and focus on the
              product instead of infrastructure.
            </p>
            <p>
              Read more about compute credits and how to use them in{' '}
              <a href="https://cirrus-ci.org/pricing/#compute-credits">documentation</a>.
            </p>
            <p>
              <b>TLDR:</b> 1 compute credit can be bought for 1 US dollar. Here is how much 1000 minutes will cost for
              different platforms:
            </p>
            <ul>
              <li>1000 minutes of 1 virtual CPU for Linux for 5 compute credits</li>
              <li>1000 minutes of 1 virtual CPU for Windows for 10 compute credits</li>
              <li>
                1000 minutes of 1 CPU with hyper-threading enabled (comparable to 2 vCPUs) for macOS for 30 compute
                credits
              </li>
            </ul>
            <b>All tasks using compute credits are charged on per-second basis.</b> 2 CPU Linux task takes 30 seconds?
            Pay <b>0.5</b> cents.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button variant="contained" onClick={this.handleOpenBuyCredits}>
            <AttachMoneyIcon />
            Add More Credits
          </Button>
          <BillingSettingsButton info={this.props.info} />
          <IconButton
            className={classNames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show Transactions"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>{this.props.transactionsComponent}</CardContent>
        </Collapse>
        <ComputeCreditsBuyDialog
          accountId={this.props.accountId}
          open={this.state.openBuyCredits}
          onClose={this.handleCloseBuyCredits}
        />
      </Card>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(ComputeCreditsBase)), {
  info: graphql`
    fragment ComputeCreditsBase_info on GitHubOrganizationInfo {
      ...BillingSettingsButton_info
    }
  `,
});
