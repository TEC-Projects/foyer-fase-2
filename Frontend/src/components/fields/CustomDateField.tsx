import React, { FunctionComponent } from 'react';
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { es } from 'date-fns/locale'
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {TextField} from "@mui/material";

interface OwnProps {
    label:string,
    value:Date | null,
    changeHandler:Function,
    maxDate:Date | null,
    minDate:Date | null,
}

type Props = OwnProps;

const CustomDateField: FunctionComponent<Props> = (props) => {

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DesktopDatePicker
              label={props.label}
              inputFormat="dd/MM/yyyy"
              maxDate={props.maxDate}
              minDate={props.minDate}
              value={props.value}
              onChange={(e) => props.changeHandler(e as Date)}
              renderInput={(params) => <TextField {...params} />}
          />
      </LocalizationProvider>
  );
};

export default CustomDateField;
