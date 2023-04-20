import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { useFragment } from 'react-relay';
import { useRecoilValue } from 'recoil';
import { graphql } from 'babel-plugin-relay/macro';

import { useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Hash from '../chips/Hash';
import Duration from '../chips/Duration';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import RepositoryOwnerChipNew from '../chips/RepositoryOwnerChipNew';
import usePageWidth from '../../utils/usePageWidth';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { muiThemeOptions } from '../../cirrusTheme';

import { BuildCard_build$key } from './__generated__/BuildCard_build.graphql';

const useStyles = makeStyles(theme => {
  return {
    card: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
    },
  };
});

interface Props {
  build: BuildCard_build$key;
  selected?: boolean;
}

export default function BuildCard(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildCard_build on Build {
        id
        changeMessageTitle
        repository {
          ...RepositoryNameChipNew_repository
          ...RepositoryOwnerChipNew_repository
        }
        ...Hash_build
        ...Duration_build
        ...BuildStatusChipNew_build
        ...BuildBranchNameChipNew_build
      }
    `,
    props.build,
  );

  let classes = useStyles();
  let theme = useTheme();
  const navigate = useNavigate();

  const pageWidth = usePageWidth();

  let isMdScreenWidth = pageWidth >= theme.breakpoints.values.md;

  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={muiTheme}>
      <Grid
        className={classes.card}
        container
        columns={4}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.5, sm: 1 }}
        wrap="wrap"
        alignItems={{ xs: 'start', sm: 'center' }}
        py={{ md: 1.5 }}
        pb={{ xs: 1, sm: 0 }}
        pt={{ xs: 1.5, sm: 0.5 }}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'action.hover',
        }}
        onClick={e => {
          const target = e.target as HTMLElement;
          if (target.closest('a')) return;
          navigateBuildHelper(navigate, e, build.id);
        }}
      >
        {/* LEFT */}
        <Grid xs={4} sm={3} md={2}>
          <Grid
            container
            spacing={{ xs: 0.5, sm: 1 }}
            alignItems={{ xs: 'start', sm: 'center' }}
            direction="row"
            wrap="nowrap"
          >
            {/* STATUS UP XS-SCREEN*/}
            <Grid display={{ xs: 'none', sm: 'block' }} minWidth={120} flexShrink={0}>
              <BuildStatusChipNew build={build} />
            </Grid>

            {/* COMMIT */}
            <Grid xs={9}>
              <Typography
                className={classes.commitName}
                variant="subtitle1"
                title={build.changeMessageTitle}
                gutterBottom
                lineHeight={1}
                mt={{ xs: 0, sm: 1 }}
              >
                {build.changeMessageTitle}
              </Typography>
              <Hash build={build} />
            </Grid>

            {/* DURATION XS-SCREEN*/}
            <Grid display={{ xs: 'block', sm: 'none' }} xs={3}>
              <Duration build={build} iconFirst />
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT */}
        <Grid xs={4} sm={1} md={2}>
          <Grid
            container
            columns={11}
            direction="row"
            spacing={{ xs: 0.5, md: 1 }}
            alignItems={{ xs: 'start', md: 'center' }}
          >
            {/* STATUS XS-SCREEN */}
            <Grid display={{ xs: 'block', sm: 'none' }}>
              <BuildStatusChipNew build={build} />
            </Grid>

            {/* REPOSITORY */}
            <Grid sm={11} md={3}>
              <RepositoryNameChipNew withHeader={isMdScreenWidth} repository={build.repository} />
            </Grid>

            {/* OWNER */}
            <Grid sm={11} md={3}>
              <RepositoryOwnerChipNew withHeader={isMdScreenWidth} repository={build.repository} />
            </Grid>

            {/* BRANCH*/}
            <Grid sm={11} md={3}>
              <BuildBranchNameChipNew withHeader={isMdScreenWidth} build={build} />
            </Grid>

            {/* DURATION UP XS-SCREEN*/}
            <Grid display={{ xs: 'none', sm: 'block' }} sm={11} md={2}>
              <Box ml={0.5} mt={{ md: 2.5 }}>
                <Duration build={build} iconFirst rightAlighment={!isMdScreenWidth} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
