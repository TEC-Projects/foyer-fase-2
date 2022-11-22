import React, { FunctionComponent } from 'react';
import blackLogo from "../../assets/identity/black_main_logo.svg";
import {Link} from "react-router-dom";
import {Box} from "@mui/material";

interface OwnProps {}

type Props = OwnProps;

const OuterNavBar: FunctionComponent<Props> = (props) => {

  return (
      <Box sx={{paddingY:4, paddingX:8}}>
          <Link to='/'>
              <img style={{width:250}} src={blackLogo} alt='Logo foyer'/>
          </Link>
      </Box>

  );
};

export default OuterNavBar;
