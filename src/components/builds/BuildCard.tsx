import { useMemo } from 'react';
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
import { muiThemeOptions } from '../../cirrusTheme';

import { BuildCard_build$key } from './__generated__/BuildCard_build.graphql';

const useStyles = makeStyles(theme => {
  return {
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
  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={muiTheme}>
      <Grid
        container
        spacing={{ xs: 0.5, sm: 1 }}
        wrap="wrap"
        alignItems={{ xs: 'start', sm: 'center' }}
        columns={4}
        py={{ md: 1.5 }}
        pb={{ xs: 0.5, sm: 0 }}
        pt={{ xs: 1, sm: 0.5 }}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'action.hover',
        }}
      >
        {/* LEFT */}
        <Grid xs={2} sm={3} md={2}>
          <Grid
            container
            spacing={{ xs: 0.5, sm: 1 }}
            alignItems={{ xs: 'start', sm: 'center' }}
            direction={{ xs: 'column', sm: 'row' }}
            wrap="nowrap"
          >
            {/* STATUS */}
            <Grid xs={3} minWidth={120} flexShrink={0}>
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
          </Grid>
        </Grid>

        {/* RIGHT */}
        <Grid xs={2} sm={1} md={2}>
          <Grid
            container
            columns={10}
            spacing={{ xs: 0.5, md: 1 }}
            alignItems={{ xs: 'start', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            wrap="nowrap"
          >
            {/* REPOSITORY */}
            <Grid sm="auto" md={3}>
              <RepositoryNameChipNew repository={build.repository} />
            </Grid>

            {/* OWNER */}
            <Grid sm="auto" md={3}>
              <RepositoryOwnerChipNew repository={build.repository} />
            </Grid>

            {/* BRANCHE*/}
            <Grid sm="auto" md={3}>
              <BuildBranchNameChipNew build={build} />
            </Grid>

            {/* DURATION */}
            <Grid sm="auto" md={1}>
              <Box ml={0.5}>
                <Duration build={build} iconFirst />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
