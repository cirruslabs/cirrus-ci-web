import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiTextField from '@material-ui/core/TextField';

const styles = theme => ({
  input: {
    '& input[readonly]': {
      padding: '10px 14px',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
    },
  },
});

function CopyPasteField(props) {
  const { classes, InputProps = {}, ...other } = props;

  return (
    <MuiTextField
      onFocus={event => {
        event.target.select();
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

CopyPasteField.propTypes = {
  classes: PropTypes.object.isRequired,
  InputProps: PropTypes.object,
};

export default withStyles(styles)(CopyPasteField);
