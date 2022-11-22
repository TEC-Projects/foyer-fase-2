import React, { FunctionComponent } from 'react';
import {Box, Typography} from "@mui/material";

interface OwnProps {
    spoilageAgentName:string
}

type Props = OwnProps;

const SpoilageAgentsListItem: FunctionComponent<Props> = (props) => {
  return (
      <Box
        sx={{
            padding:2,
            borderRadius:1,
            backgroundColor:'#f1f1f1'
        }}
      >
          <Typography>{props.spoilageAgentName}</Typography>
      </Box>
  );
};

export default SpoilageAgentsListItem;
