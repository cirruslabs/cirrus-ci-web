import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from '@emotion/react';

import { useTheme } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import { WithStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import { muiThemeOptions } from '../../cirrusTheme';

// todo: move custom values to mui theme adjustments
const styles = theme =>
  createStyles({
    table: {
      tableLayout: 'auto',
    },
    cell: {
      fontSize: 16,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      '& *': {
        fontSize: '16px !important',
      },
    },
  });

const styled = withStyles(styles);

interface Props extends WithStyles<typeof styles> {}

const RepositoryTable = styled(({ classes }: Props) => {
  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={muiTheme}>
      <Table className={classes.table}>
        <TableHead>
          <HeadRow />
        </TableHead>
        <TableBody>
          <RepositoryRow />
        </TableBody>
      </Table>
    </ThemeProvider>
  );
});

interface HeadRowProps extends WithStyles<typeof styles> {}

const HeadRow = styled(({ classes }: HeadRowProps) => {
  return (
    <TableRow>
      <TableCell className={classes.cell}>Repository</TableCell>
      <TableCell className={classes.cell}>Last Build</TableCell>
    </TableRow>
  );
});

interface RepositoryRowProps extends WithStyles<typeof styles> {}

const RepositoryRow = styled(({ classes }: RepositoryRowProps) => {
  return (
    <TableRow>
      {/* REPOSITORY */}
      <TableCell className={classes.cell}>Repository</TableCell>
      {/* LAST BUILD */}
      <TableCell className={classes.cell}>Last build</TableCell>
    </TableRow>
  );
});

export default RepositoryTable;
