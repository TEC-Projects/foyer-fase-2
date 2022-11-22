import React, {FunctionComponent, useEffect} from 'react';
import {TextField} from "@mui/material";

interface OwnProps {
    label:string,
    value:string,
    changeHandler:Function,
    isElementField?:Boolean,
    globalIdChangeHandler?:Function,
    currentId?:number | string,
}

type Props = OwnProps;

const CustomTextArea: FunctionComponent<Props> = (props) => {

    const handleElementIdChange = () => {
        if(props.isElementField && props.globalIdChangeHandler){
            props.globalIdChangeHandler(props.currentId)
        }
    }

  return (
      <TextField
          variant='outlined'
          multiline
          rows={4}
          label={props.label}
          value={props.value}
          onClick={handleElementIdChange}
          onChange={(e) => props.changeHandler(e.target.value)}
          sx={{
              my:1,
              width:'100%',
              '& label.Mui-focused': {
                  color: '#606060',
              },
              '& .MuiInput-underline:after': {
                  borderBottomColor: '#606060',
              },
              '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                      borderColor: '#b4b4b4',
                  },
                  '&:hover fieldset': {
                      borderColor: '#b4b4b4',
                  },
                  '&.Mui-focused fieldset': {
                      borderColor: '#b4b4b4',
                  },
              },
          }}
      />
  );
};

export default CustomTextArea;
