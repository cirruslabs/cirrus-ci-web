import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import cx from 'classnames';

import CallSplitIcon from '@mui/icons-material/CallSplit';
import UnarchiveIcon from '@mui/icons-material/UnarchiveOutlined';
import { Tooltip, useTheme } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import { navigateHelper } from 'utils/navigateHelper';
import { shorten } from 'utils/text';

import { BuildBranchNameChipNew_build$key } from './__generated__/BuildBranchNameChipNew_build.graphql';

const useStyles = makeStyles(theme => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(1),
    },
    chip: {
      flexGrow: 0,
    },
  };
});

interface Props {
  build: BuildBranchNameChipNew_build$key;
  withHeader?: boolean;
  className?: string;
}

export default function BuildBranchNameChipNew(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildBranchNameChipNew_build on Build {
        id
        branch
        tag
        repository {
          id
          owner
          name
        }
      }
    `,
    props.build,
  );

  let classes = useStyles();
  let navigate = useNavigate();
  let theme = useTheme();

  function handleBranchClick(event) {
    event.preventDefault();
    if (build.repository) {
      navigateHelper(
        navigate,
        event,
        '/github/' + build.repository.owner + '/' + build.repository.name + '/' + build.branch,
      );
    }
  }

  return (
    <div className={props.withHeader ? classes.container : ''}>
      {props.withHeader && (
        <Typography variant="caption" color={theme.palette.text.disabled} lineHeight={1}>
          Branch
        </Typography>
      )}
      {build.tag ? (
        <Tooltip title={`${build.tag} tag`}>
          <Chip
            className={cx(props.className, classes.chip)}
            label={shorten(build.branch)}
            avatar={<UnarchiveIcon />}
            size="small"
            onClick={handleBranchClick}
            onAuxClick={handleBranchClick}
          />
        </Tooltip>
      ) : (
        <Chip
          className={cx(props.className, classes.chip)}
          label={shorten(build.branch)}
          avatar={<CallSplitIcon />}
          size="small"
          title={build.branch}
          onClick={handleBranchClick}
          onAuxClick={handleBranchClick}
        />
      )}
    </div>
  );
}
