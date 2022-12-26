import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { graphql } from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { createTheme } from '@mui/material/styles';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import { Table, TableRow, TableHead, TableBody, TableCell, Typography } from '@mui/material';

import { muiThemeOptions } from '../../cirrusTheme';
import { navigateRepositoryHelper } from '../../utils/navigateHelper';
import BuildPreview from '../builds/BuildPreview';

import { RepositoryTable_repositories } from './__generated__/RepositoryTable_repositories.graphql';

// todo: move custom values to mui theme adjustments
const styles = () =>
  createStyles({
    row: {
      cursor: 'pointer',
    },
    cellRepository: {},
    cellLastBuild: {
      width: '600px',
      maxWidth: '600px',
      minWidth: '600px',
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
      <Table>
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
      <TableCell className={classes.cellRepository}>Repository</TableCell>
      <TableCell className={classes.cellLastBuild}>Last Build</TableCell>
    </TableRow>
  );
});

interface RepositoryRowProps extends WithStyles<typeof styles> {
  repository: RepositoryTable_repositories[number];
}

const RepositoryRow = styled(({ classes, repository }: RepositoryRowProps) => {
  let navigate = useNavigate();

  let build = repository.lastDefaultBranchBuild;
  if (!build) return null;

  const onClick = e => {
    if (e.target.closest('a')) return;
    navigateRepositoryHelper(navigate, e, repository.owner, repository.name);
  };

  return (
    <TableRow className={classes.row} onClick={onClick} onAuxClick={onClick} hover>
      {/* REPOSITORY */}
      <TableCell className={classes.cellRepository}>
        <Typography title={repository.name} noWrap>
          {repository.name}
        </Typography>
      </TableCell>

      {/* LAST BUILD */}
      <TableCell className={classes.cellLastBuild}>
        <BuildPreview build={build} />
      </TableCell>
    </TableRow>
  );
});

export default createFragmentContainer(RepositoryTable, {
  repositories: graphql`
    fragment RepositoryTable_repositories on Repository @relay(plural: true) {
      id
      owner
      name
      platform
      lastDefaultBranchBuild {
        id
        ...BuildPreview_build
      }
    }
  `,
});
