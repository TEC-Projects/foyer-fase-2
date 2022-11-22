import React, { FunctionComponent } from 'react';
import {Box, IconButton, Stack, Typography, useTheme} from "@mui/material";
import {Responsible, Role} from "../../../../types/responsible.types";
import {personnelTypeFormatter, roleFormatter, roleListFormatter} from "../../../../util/formatterUtil";
import UnderlineButton from "../../../../components/buttons/UnderlineButton";
import {useNavigate} from "react-router-dom";
import {Edit} from "@mui/icons-material";
import {getSessionData} from "../../../../util/sessionDataUtil";

interface OwnProps {
    responsibleData:Responsible
}

type Props = OwnProps;

const ResponsibleListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();
    const navigate = useNavigate();

    const showEditOption = getSessionData()?.user.type === 'ADMIN_USER';

    return (
        <Stack
            sx={{
                backgroundColor:'#f1f1f1',
                borderRadius:1,
                padding:4,
            }}
        >
            <Box
                sx={{
                    display:'flex',
                    alignItems:'flex-start',
                    justifyContent:'space-between',
                    marginBottom:2,
                }}
            >
                <Box>
                    <Typography variant='h5' fontWeight='bold' sx={{marginRight:2}}>{props.responsibleData.user.name + ' ' + props.responsibleData.user.surname}</Typography>
                    <Typography color={theme.palette.primary.main} fontWeight='bold' sx={{paddingBottom:0.2}}>{personnelTypeFormatter(props.responsibleData.type)}</Typography>
                </Box>
                {
                    showEditOption ?
                        <Box sx={{marginTop:-1}}>
                            <IconButton
                                onClick={() => navigate('modify-responsible', {state:{
                                        id: props.responsibleData.id,
                                        fullName: props.responsibleData.user.name + " " + props.responsibleData.user.surname,
                                        role: props.responsibleData.role,
                                        companyName: props.responsibleData.companyName
                                    }})}

                            >
                                <Edit sx={{color:theme.palette.primary.main}}/>
                            </IconButton>
                        </Box>
                    :
                        null
                }

            </Box>
            <Typography>Roles: {roleListFormatter(props.responsibleData.role)}</Typography>
            <Typography>Identificación: {props.responsibleData.user.id}</Typography>
            <Typography>Correo electrónico: {props.responsibleData.user.email}</Typography>
            {
                props.responsibleData.type === 'CONTRACTOR' ? <Typography>Empresa: {props.responsibleData.companyName}</Typography> : null
            }
        </Stack>
    );
};

export default ResponsibleListItem;
