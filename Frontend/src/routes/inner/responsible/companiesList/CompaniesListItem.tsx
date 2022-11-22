import React, { FunctionComponent } from 'react';
import {Box, IconButton, Stack, Typography, useTheme} from "@mui/material";
import {Company} from "../../../../types/responsible.types";
import {useNavigate} from "react-router-dom";
import {Edit} from "@mui/icons-material";
import {getSessionData} from "../../../../util/sessionDataUtil";

interface OwnProps {
    companyData:Company
}

type Props = OwnProps;

const CompaniesListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();
    const navigate = useNavigate();
    const showEditOption = getSessionData()?.user.type === 'ADMIN_USER';

    return (
        <Stack
            sx={{
                backgroundColor:theme.palette.primary.main,
                borderRadius:1,
                padding:2,
            }}
        >
            <Box
                sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'flex-start'
                }}
            >
                <Box sx={{marginBottom:1}}>
                    <Typography fontWeight='bold' color='white'>Razón social</Typography>
                    <Typography color='white'>{props.companyData.name}</Typography>
                </Box>
                {
                    showEditOption ?
                        <Box sx={{marginTop:-1}}>
                            <IconButton
                                onClick={() => navigate(
                                    'modify-company',
                                    {state:props.companyData}
                                )}
                            >
                                <Edit sx={{color:'white'}}/>
                            </IconButton>
                        </Box>
                    :
                        null
                }
            </Box>


            <Box sx={{marginBottom:1}}>
                <Typography fontWeight='bold' color='white'>Identificación</Typography>
                <Typography color='white'>{props.companyData.id}</Typography>
            </Box>
            <Box sx={{marginBottom:1}}>
                <Typography fontWeight='bold' color='white'>Correo electrónico</Typography>
                <Typography color='white'>{props.companyData.email}</Typography>
            </Box>
        </Stack>
    );
};

export default CompaniesListItem;
