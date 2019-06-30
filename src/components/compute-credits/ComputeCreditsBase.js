import React from 'react';
import {withStyles} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ComputeCreditsTransactionsList from "./ComputeCreditsTransactionsList";
import Typography from "@material-ui/core/Typography/Typography";
import Collapse from "@material-ui/core/Collapse/Collapse";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames'
import ComputeCreditsBuyDialog from "./ComputeCreditsBuyDialog";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {orange} from "@material-ui/core/colors";
import BillingSettingsButton from "./BillingSettingsButton";

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  gap: {
    paddingTop: 16
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
  }
});

class ComputeCreditsBase extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {expanded: false, openBuyCredits: false};

  handleExpandClick = () => {
    this.setState(prevState => ({
      ...prevState,
      expanded: !prevState.expanded
    }));
  };

  handleOpenBuyCredits = () => {
    this.setState(prevState => ({
      ...prevState,
      openBuyCredits: true
    }));
  };

  handleCloseBuyCredits = () => {
    this.setState(prevState => ({
      ...prevState,
      openBuyCredits: false
    }));
  };

  render() {
    let {classes} = this.props;
    let transactionEdges = (this.props.transactions || {}).edges || [];
    let transactions = transactionEdges.map(edge => edge.node);

    return (
      <Card>
        <CardHeader title="Compute Credits"/>
        <CardContent>
          <Typography variant="h6">
            Your current compute credits balance: <b className={classes.credits}>{this.props.balanceInCredits || "0.00"}</b>
          </Typography>
          <div className={classes.gap}/>
          <Typography variant="subtitle1">
            <p>
              Compute credits are used for buying <b>priority</b> CPU time on Community Clusters for your private or public projects. It
              allows not to bother about configuring <a href="https://cirrus-ci.org/guide/supported-computing-services/">Compute Services</a> and
              focus on the product instead of infrastructure.
            </p>
            <p>
              Read more about compute credits and how to use them in <a
              href="https://cirrus-ci.org/pricing/#compute-credits">documentation</a>.
            </p>
            <p>
              <b>TLDR:</b> 1 compute credit can be bought for 1 US dollar. Here is how much 1000 minutes will cost for
              different platforms:
            </p>
            <ul>
              <li>1000 minutes of 1 virtual CPU for Linux for 5 compute credits</li>
              <li>1000 minutes of 1 virtual CPU for Windows for 10 compute credits</li>
              <li>1000 minutes of 1 CPU with hyper-threading enabled (comparable to 2 vCPUs) for macOS for 30 compute credits</li>
            </ul>
            <b>All tasks using compute credits are charged on per-second basis.</b> 2 CPU Linux task takes 30 seconds?
            Pay <b>0.5</b> cents.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained"
                  onClick={this.handleOpenBuyCredits}>
            <AttachMoneyIcon/>
            Add More Credits
          </Button>
          { this.props.billingSettings && <BillingSettingsButton billingSettings={this.props.billingSettings}/> }
          <IconButton
            className={classNames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show Transactions"
          >
            <ExpandMoreIcon/>
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ComputeCreditsTransactionsList transactions={transactions}/>
          </CardContent>
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

export default withRouter(withStyles(styles)(ComputeCreditsBase));
