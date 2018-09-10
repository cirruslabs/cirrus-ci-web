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

class ComputeCredits extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let transactionEdges = (this.props.info.transactions || {}).edges || [];
    let transactions = transactionEdges.map(edge => edge.node);

    return (
      <Card>
        <CardHeader title="Compute Credits"/>
        <CardContent>
          <Typography variant="subheading">
            You have <b>{this.props.info.balanceInCredits || "0.00"}</b> credits left.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained">
            <AttachMoneyIcon/>
            Buy More Credits
          </Button>
        </CardActions>
        <CardContent>
          <ComputeCreditsTransactionsList transactions={transactions}/>
        </CardContent>
      </Card>
    );
  }
}

export default createPaginationContainer(
  withRouter(withStyles({})(ComputeCredits)),
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
