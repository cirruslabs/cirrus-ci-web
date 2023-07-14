import React, { useState } from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import mui from 'mui';

import BillingSettingsButton from './BillingSettingsButton';
import ComputeCreditsStripeDialog from './ComputeCreditsStripeDialog';
import { ComputeCreditsBase_info$key } from './__generated__/ComputeCreditsBase_info.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
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
      color: mui.colors.orange[700],
      '&:hover': {
        color: mui.colors.orange[900],
      },
    },
  };
});

interface Props {
  transactionsComponent: JSX.Element;
  info?: ComputeCreditsBase_info$key;
  balanceInCredits?: string;
  ownerUid: string;
}

export default function ComputeCreditsBase(props: Props) {
  let info = useFragment(
    graphql`
      fragment ComputeCreditsBase_info on OwnerInfo {
        ...BillingSettingsButton_info
      }
    `,
    props.info ?? null,
  );

  let [expanded, setExpanded] = useState(false);
  let [openBuyCredits, setOpenBuyCredits] = useState(false);
  let classes = useStyles();

  return (
    <mui.Card elevation={24}>
      <mui.CardHeader title="Compute Credits" />
      <mui.CardContent>
        <mui.Typography variant="h6">
          Your current compute credits balance: <b className={classes.credits}>{props.balanceInCredits || '0.00'}</b>
        </mui.Typography>
        <mui.Typography variant="subtitle1">
          <p>
            Compute credits are used for buying CPU time managed instances for your projects. It allows not to bother
            about configuring{' '}
            <mui.Link color="inherit" href="https://cirrus-ci.org/guide/supported-computing-services/">
              Compute Services
            </mui.Link>{' '}
            and focus on the product instead of infrastructure. Read more about compute credits and how to use them in{' '}
            <mui.Link color="inherit" href="https://cirrus-ci.org/pricing/#compute-credits">
              documentation
            </mui.Link>
            .
          </p>
        </mui.Typography>
      </mui.CardContent>
      <mui.CardActions disableSpacing>
        <mui.Button variant="contained" onClick={() => setOpenBuyCredits(true)} className={classes.buttonSpacing}>
          <mui.icons.AttachMoney />
          Add More Credits
        </mui.Button>
        <BillingSettingsButton info={info} />
        <mui.IconButton
          className={classNames(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Show Transactions"
          size="large"
        >
          <mui.icons.ExpandMore />
        </mui.IconButton>
      </mui.CardActions>
      <mui.Collapse in={expanded} timeout="auto" unmountOnExit>
        <mui.CardContent>{props.transactionsComponent}</mui.CardContent>
      </mui.Collapse>
      <ComputeCreditsStripeDialog
        ownerUid={props.ownerUid}
        open={openBuyCredits}
        onClose={() => setOpenBuyCredits(false)}
      />
    </mui.Card>
  );
}
