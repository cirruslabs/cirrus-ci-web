import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from '@emotion/react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useNavigate } from 'react-router-dom';

import { WithStyles } from '@mui/styles';
import { useTheme } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';

import { muiThemeOptions } from '../../cirrusTheme';
import { navigateRepositoryHelper } from '../../utils/navigateHelper';

import { RepositoryTable_repositories } from './__generated__/RepositoryTable_repositories.graphql';

// todo: move custom values to mui theme adjustments
const styles = theme =>
  createStyles({
    table: {
      tableLayout: 'auto',
    },
    row: {
      cursor: 'pointer',
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

interface Props extends WithStyles<typeof styles> {
  repositories: RepositoryTable_repositories;
}

const RepositoryTable = styled(({ classes, repositories = [] }: Props) => {
  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={muiTheme}>
      <Table className={classes.table}>
        <TableHead>
          <HeadRow />
        </TableHead>
        <TableBody>
          {repositories.map(repository => (
            <RepositoryRow key={repository.id} repository={repository} />
          ))}
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

interface RepositoryRowProps extends WithStyles<typeof styles> {
  repository: RepositoryTable_repositories[number];
}

const RepositoryRow = styled(({ classes, repository }: RepositoryRowProps) => {
  const theme = useTheme();
  let navigate = useNavigate();

  let build = repository.lastDefaultBranchBuild;
  if (!build) {
    return null;
  }

  const onClick = e => {
    navigateRepositoryHelper(navigate, e, repository.owner, repository.name);
  };

  return (
    <TableRow className={classes.row} hover={true} onClick={onClick} onAuxClick={onClick}>
      {/* REPOSITORY */}
      <TableCell className={classes.cell}>
        <Typography noWrap title={repository.name}>
          {repository.name}
        </Typography>
      </TableCell>
      <TableCell>Some build...</TableCell>
    </TableRow>
  );
});

export default createFragmentContainer(RepositoryTable, {
  repositories: graphql`
    fragment RepositoryTable_repositories on Repository @relay(plural: true) {
      id
      owner
      name
      lastDefaultBranchBuild {
        id
      }
    }
  `,
});
