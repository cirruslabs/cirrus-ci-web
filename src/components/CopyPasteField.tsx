import React from 'react';
import classNames from 'classnames';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import MuiTextField, { StandardTextFieldProps } from '@material-ui/core/TextField';

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

  return (
    <MuiTextField
      onFocus={event => {
        event.target.select();
        document.execCommand('copy');
      }}
      InputProps={{
        ...InputProps,
        disableUnderline: true,
        className: classNames(classes.input, InputProps.className),
      }}
      {...other}
    />
  );
}

export default withStyles(styles)(CopyPasteField);
