import React, { FunctionComponent } from 'react';
import {InspectionUpdate} from "../../../../types/inspection.types";
import {Grid, Typography} from "@mui/material";
import { dateFormatter } from '../../../../util/formatterUtil';

interface OwnProps {
    update:InspectionUpdate
}

type Props = OwnProps;

const InspectionUpdateHistoryItem: FunctionComponent<Props> = (props) => {

  return (
      <Grid container spacing={8}>
         <Grid item xs={4}>
             <Typography>{props.update.authorName}</Typography>
         </Grid>
          <Grid item xs={4}>
              <Typography>{props.update.description}</Typography>
         </Grid>
          <Grid item xs={4}>
              <Typography>{dateFormatter(props.update.date,'short')}</Typography>
          </Grid>
      </Grid>
  );
};

export default InspectionUpdateHistoryItem;
