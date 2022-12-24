import { ReactChild } from 'react';
import { Paper as MuiPaper } from '@mui/material';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import cx from 'classnames';

let styles = theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1.0, 2.5, 1.5),
      boxShadow: '0 16px 52px rgb(0 0 0 / 13%)',
      borderRadius: 4 * theme.shape.borderRadius,
    },
  });

interface Props extends WithStyles<typeof styles> {
  className?: string;
  children: ReactChild | ReactChild[];
}

const Paper = ({ classes, className, children }: Props) => {
  return <MuiPaper className={cx(className, classes.paper)}>{children}</MuiPaper>;
};

export default withStyles(styles)(Paper);
