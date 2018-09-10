import React from 'react';
import {createPaginationContainer, graphql} from 'react-relay';
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
import IconButton from "@material-ui/core/IconButton/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames'

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
});

class ComputeCredits extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {expanded: false};

  handleExpandClick = () => {
    this.setState(state => ({expanded: !state.expanded}));
  };

  render() {
    let {info, classes} = this.props;
    let transactionEdges = (info.transactions || {}).edges || [];
    let transactions = transactionEdges.map(edge => edge.node);

    return (
      <Card>
        <CardHeader title="Compute Credits"/>
        <CardContent>
          <Typography variant="subheading">
            You have <b>{this.props.info.balanceInCredits || "0.00"}</b> credits left.
          </Typography>
          <div className={classes.gap}/>
          <Typography variant="subheading">
            Compute credits are used for buying CPU time on Community Clusters for your private or public projects. It
            allows
            not to bother about configuring <a href="https://cirrus-ci.org/guide/supported-computing-services/">Compute
            Services</a> and
            focus on the product instead of infrastructure.
          </Typography>
          <div className={classes.gap}/>
          <Typography variant="subheading">
            Read more about compute credits and how to use them in <a
            href="https://cirrus-ci.org/pricing/#compute-credits">documentation</a>.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained">
            <AttachMoneyIcon/>
            Buy More Credits
          </Button>
          <IconButton
            className={classNames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon/>
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ComputeCreditsTransactionsList transactions={transactions}/>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default createPaginationContainer(
  withRouter(withStyles(styles)(ComputeCredits)),
  {
    info: graphql`
      fragment ComputeCredits_info on GitHubOrganizationInfo
      @argumentDefinitions(
        count: {type: "Int", defaultValue: 20}
        cursor: {type: "String"}
      ) {
        name
        balanceInCredits
        transactions(
          last: $count
          after: $cursor
        ) @connection(key: "ComputeCredits_transactions") {
          edges {
            node {
              ...ComputeCreditsTransactionRow_transaction
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.info && props.info.transactions;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count: count,
        cursor: cursor,
        organization: props.info.name
      };
    },
    query: graphql`
      query ComputeCreditsQuery(
        $count: Int!
        $cursor: String
        $organization: String!
      ) {
        githubOrganizationInfo(organization: $organization) {
          ...ComputeCredits_info @arguments(count: $count, cursor: $cursor)
        }
      }
    `
  }
);
