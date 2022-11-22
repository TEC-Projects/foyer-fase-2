import React, {FunctionComponent, useState} from 'react';
import {Grid} from "@mui/material";
import {Link} from "react-router-dom";
import whiteLogo from "../../../assets/identity/white_main_logo.svg";
import whiteSimpleLogo from "../../../assets/identity/white_simple_logo.svg";
import InnerNavBarMenuItems from "./InnerNavBarMenuItems";
import InnerNavBarSubMenu from "./InnerNavBarSubMenu";

interface OwnProps {}

type Props = OwnProps;

const InnerNavBar: FunctionComponent<Props> = (props) => {

    const [navBarSettings, setNavBarSettings] = useState({
        logoSize: 250,
        verticalPadding: 4,
        logo: whiteLogo,
    });

    const handleChangeNavBar = () =>{
        if(window.scrollY < 50){
            setNavBarSettings({
                logoSize:250,
                verticalPadding: 4,
                logo: whiteLogo,
            });
        }
        else{
            setNavBarSettings({
                logoSize:100,
                verticalPadding: 2,
                logo: whiteSimpleLogo,
            });
        }
    };
    window.addEventListener('scroll', handleChangeNavBar);

    return(
        <Grid container gap={0} sx={{paddingY:navBarSettings.verticalPadding, paddingX:8, backgroundColor:'black', position:'fixed', zIndex:100}}>
            <Grid item xs={2} sx={{}}>
                <Link to='/'>
                    <img style={{width:navBarSettings.logoSize}} src={navBarSettings.logo}  alt='Logo foyer'/>
                </Link>
            </Grid>
            <Grid item xs={8} gap={4} sx={{display:'flex',justifyContent:'flex-end', alignItems:'center'}}>
                <InnerNavBarMenuItems/>
            </Grid>
            <Grid item xs={2} sx={{display:'flex',justifyContent:'flex-end', alignItems:'center'}}>
                <InnerNavBarSubMenu/>
            </Grid>
        </Grid>
    );
};

export default InnerNavBar;
