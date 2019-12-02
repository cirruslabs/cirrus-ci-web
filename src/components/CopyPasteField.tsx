import React from 'react';
import classNames from 'classnames';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import MuiTextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CopyIcon from '@material-ui/icons/FileCopy';
import { copyToClipboard } from '../utils/pageManipulation';

const styles = theme =>
  createStyles({
    input: {
      '& input[readonly]': {
        padding: '10px 14px',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey[100],
      },
    },
  });

type Props = WithStyles<typeof styles> & StandardTextFieldProps;

function CopyPasteField(props: Props) {
  const { classes, InputProps = {}, ...other } = props;

  InputProps.endAdornment = (
    <InputAdornment position="end">
      <CopyIcon onClick={e => copyToClipboard(actualComponent)} />
    </InputAdornment>
  );

  const actualComponent = (
    <MuiTextField
      onFocus={event => event.target.select()}
      InputProps={{
        ...InputProps,
        disableUnderline: true,
        className: classNames(classes.input, InputProps.className),
      }}
      {...other}
    />
  );

  return <div>{actualComponent}</div>;
}

export default withStyles(styles)(CopyPasteField);
