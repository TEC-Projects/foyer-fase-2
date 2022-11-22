import React, { FunctionComponent } from 'react';
import {Container, Box, Button, Stack, Typography, Grid} from "@mui/material";
import InnerNavBar from "../../components/nav/innerNavBar/InnerNavBar";
import {Link, useNavigate} from "react-router-dom";
import blackLogo from "../../assets/identity/black_main_logo.svg";
import OuterNavBar from "../../components/nav/OuterNavBar";

interface OwnProps {}

type Props = OwnProps;



const Unauthorized: FunctionComponent<Props> = (props) => {

  const navigate = useNavigate();

  return (
      <Box>
        <OuterNavBar/>
        <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '70vh' }}
        >
          <Grid item xs={6}>
            <Stack sx={{gap:4}}>
              <Typography variant='h1' fontWeight='bold'>Error 401</Typography>
              <Typography variant='h3' display="block">No cuentas con los permisos necesario  para accesar esta dirección.</Typography>
              <Button
                  variant='contained'
                  sx={{color:'white', width:'50%'}}
                  onClick={() => navigate('/')}
              >Volver al inicio</Button>
            </Stack>
          </Grid>

        </Grid>
      </Box>
  );
};

export default Unauthorized;
