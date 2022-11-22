import React, {FunctionComponent, useEffect, useState} from 'react';
import blackLogo from "../../assets/identity/black_main_logo.svg";
import {Link, useNavigate} from "react-router-dom";
import {Box, Stack} from "@mui/material";
import UnderlineButton from "../../buttons/UnderlineButton";
import {NavMenuItem, SessionData} from "../../../types/common.types";
import {getAdminNavItems, getDirectorNavItems, getOperativeNavItems} from "./menuItemsPerUserType";
import {getSessionData} from "../../../util/sessionDataUtil";

interface OwnProps {}

type Props = OwnProps;

const OuterNavBar: FunctionComponent<Props> = (props) => {

    const navigate = useNavigate();

    const sessionData : SessionData | null | undefined = getSessionData();

    const [navItems, setNavItems] = useState<Array<NavMenuItem>>([]);

    useEffect(() => {
        switch (sessionData?.user.type){
            case 'OPERATIVE_USER':
                setNavItems(getOperativeNavItems(navigate));
                break;
            case 'ADMIN_USER':
                setNavItems(getAdminNavItems(navigate))
                break;
            case 'SUPER_USER':
                setNavItems([])
                break;
            case 'DIRECTOR_USER':
                setNavItems(getDirectorNavItems(navigate))
                break;
        }
    }, []);


    return (
        <Stack
            direction='row'
            gap={4}
        >
            {
                navItems.map((item) => {
                    return(
                        <UnderlineButton buttonBackgroundColor='black' buttonTextColor='white' action={item.action} label={item.label}/>
                    );
                })
            }
        </Stack>
    );
};

export default OuterNavBar;
