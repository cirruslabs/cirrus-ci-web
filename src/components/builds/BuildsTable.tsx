import { withStyles, WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';

const styles = () =>
  createStyles({
    root: {},
  });

interface Props extends WithStyles<typeof styles> {}

function BuildsTable({ classes }: Props) {
  return <div className={classes.root}>NEW TABLE</div>;
}

export default withStyles(styles)(BuildsTable);
