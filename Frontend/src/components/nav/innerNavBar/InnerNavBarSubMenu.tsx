import React, { FunctionComponent } from 'react';
import {Avatar, Box, Button, IconButton, Menu, Typography, useTheme} from "@mui/material";
import {SessionData} from "../../../types/common.types";
import {clearSession, getSessionData} from "../../../util/sessionDataUtil";
import {useNavigate} from "react-router-dom";
import {userTypeFormatter} from "../../../util/formatterUtil";

interface OwnProps {}

type Props = OwnProps;

const InnerNavBarSubMenu: FunctionComponent<Props> = (props) => {

    const navigate = useNavigate();
    const theme = useTheme();

    const handleSignOut = () => {
        clearSession();
        navigate('/');
        navigate(0);
    }

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const sessionData : SessionData | null | undefined = getSessionData();
    let userInitials : string = '';
    let userFullName : string  = '';
    let userType : string   = '';

    if(sessionData){
        userInitials = (sessionData.user.name[0] || "")  + (sessionData.user.surname[0] || "")
        userFullName  = (sessionData.user.name || "")  + " " + (sessionData.user.surname || "")
        userType = userTypeFormatter(sessionData.user.type);
    }


return (
      <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ backgroundColor: theme.palette.primary.main }}> {userInitials}</Avatar>
          </IconButton>
          <Menu
              sx={{ mt: '50px',}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
          >
              <Box sx={{ padding: 2}} >
                  <Typography fontWeight='bold'>{userFullName}</Typography>
                  <Typography >{userType}</Typography>
                  <Button
                      onClick={handleSignOut}
                      disableRipple
                      variant='text'
                      sx={{
                          marginTop: 2,
                          width:'100%',
                          justifyContent: 'flex-start',
                          paddingY:1,
                          paddingX:0
                      }}
                  >Cerrar sesión</Button>
              </Box>
          </Menu>
      </Box>
  );
};

export default InnerNavBarSubMenu;
