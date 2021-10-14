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
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BillingSettingsButton from './BillingSettingsButton';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { ComputeCreditsBase_info } from './__generated__/ComputeCreditsBase_info.graphql';
import { Helmet as Head } from 'react-helmet';
import ComputeCreditsStripeDialog from './ComputeCreditsStripeDialog';

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
    buttonSpacing: {
      marginRight: '8px',
    },
    gap: {
      paddingTop: 16,
    },
    modal: {
      top: '25%',
      margin: 'auto',
      position: 'absolute',
      width: theme.spacing(50.0),
      backgroundColor: theme.palette.primary.contrastText,
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
  ownerUid: string;
}

function ComputeCreditsBase(props: Props) {
  let [expanded, setExpanded] = useState(false);
  let [openBuyCredits, setOpenBuyCredits] = useState(false);
  let { classes } = props;

  return (
    <Card>
      <CardHeader title="Compute Credits" />
      <Head>
        <script src="https://js.stripe.com/v3/" async></script>
      </Head>
      <CardContent>
        <Typography variant="h6">
          Your current compute credits balance: <b className={classes.credits}>{props.balanceInCredits || '0.00'}</b>
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
          <b>All tasks using compute credits are charged on per-second basis.</b> 2 CPU Linux task takes 30 seconds? Pay{' '}
          <b>0.5</b> cents.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button variant="contained" onClick={() => setOpenBuyCredits(true)} className={classes.buttonSpacing}>
          <AttachMoneyIcon />
          Add More Credits
        </Button>
        <BillingSettingsButton info={props.info} />
        <IconButton
          className={classNames(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Show Transactions"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{props.transactionsComponent}</CardContent>
      </Collapse>
      <ComputeCreditsStripeDialog
        ownerUid={props.ownerUid}
        open={openBuyCredits}
        onClose={() => setOpenBuyCredits(false)}
      />
    </Card>
  );
}

export default createFragmentContainer(withStyles(styles)(withRouter(ComputeCreditsBase)), {
  info: graphql`
    fragment ComputeCreditsBase_info on GitHubOrganizationInfo {
      ...BillingSettingsButton_info
    }
  `,
});
