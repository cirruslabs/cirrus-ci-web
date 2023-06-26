import React from 'react';

import copy from 'clipboard-copy';

import CopyIcon from '@mui/icons-material/FileCopy';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { OutlinedInputProps } from '@mui/material/OutlinedInput/OutlinedInput';

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
              copy(props.value!.toString());
            }}
            edge="end"
            size="large"
          >
            <CopyIcon />
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  );
}

export default CopyPasteField;
