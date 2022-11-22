import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Grid, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import Header from "../../../components/Header";
import {storyTypeFormatter} from "../../../util/formatterUtil";
import AreaElementList from "./areaDetail/areaElementList/AreaElementList";
import {Warning} from "@mui/icons-material";
import CustomTextField from "../../../components/fields/CustomTextField";
import DownloadableFileList from "../../../components/downloadableList/DownloadableFileList";
import {Element as ElementStructure} from "../../../types/area.types";
import {DownloadableFile} from "../../../types/common.types";
import {getSessionData} from "../../../util/sessionDataUtil";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {useNavigate, useParams} from "react-router-dom";
import {getAreaDetail, getAreaElementDetail} from "../../../graphQL/Functions/area";

interface OwnProps {}

type Props = OwnProps;

const ElementDetail: FunctionComponent<Props> = (props) => {

    const theme = useTheme();
    const apolloClient = useApolloClient()
    const {showSnackbar} = useContext(Context);
    const navigate = useNavigate();
    const {elementId} = useParams()

    const showFirstButton = getSessionData()?.user.type === 'ADMIN_USER';

    const [elementDetail, setElementDetail] = useState<ElementStructure>({
        id: '',
        name: '',
        parentArea: '',
        location: '',
        description: '',
        imagesListing: [],
    });


    useEffect(() => {
        try {
            getAreaElementDetail(apolloClient, setElementDetail, elementId as string)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])

    return (
        <Box>
            <GoBackButton/>
            <Header
                title={elementDetail.name}
                showFirstButton={showFirstButton}
                firstButtonLabel={'Transferir elemento'}
                firstButtonNavigationRoute={'transfer-element'}
                firstButtonParams={{
                    elementId: elementDetail.id,
                    elementName:elementDetail.name,
                    parentArea: elementDetail.parentArea,
                }}
                showSecondButton={false}
            />
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Typography fontWeight='bold' color={theme.palette.primary.main} sx={{marginBottom:2}}>Elemento no. {elementDetail.id}</Typography>
                    <Grid container spacing={4} sx={{marginBottom:4}}>
                        <Grid item xs={4}>
                            <Typography fontWeight='bold'>Localización:<Typography>{elementDetail.parentArea}</Typography></Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography fontWeight='bold'>Ubicación exacta:<Typography>{elementDetail.location}</Typography></Typography>
                        </Grid>
                    </Grid>
                    <Typography fontWeight='bold' sx={{marginBottom:8}}>Descripción:<Typography>{elementDetail.description}</Typography></Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant='h5' fontWeight='bold'>Imágenes del elemento</Typography>
                    <DownloadableFileList downloadableFileList={elementDetail.imagesListing}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ElementDetail;
