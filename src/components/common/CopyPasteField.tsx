import React from 'react';
import {IconButton, InputAdornment, OutlinedInput} from "@material-ui/core";
import CopyIcon from "@material-ui/icons/FileCopy";
import copy from "clipboard-copy"
import {OutlinedInputProps} from "@material-ui/core/OutlinedInput/OutlinedInput";

function CopyPasteField(props: OutlinedInputProps) {
  return (
    <OutlinedInput
      value={props.value}
      contentEditable={false}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="copy"
            onClick={event => {
              copy(props.value.toString())
            }}
            edge="end"
          >
            <CopyIcon/>
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  )
}

export default CopyPasteField;
