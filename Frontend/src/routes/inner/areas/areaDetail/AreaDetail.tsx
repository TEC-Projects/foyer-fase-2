import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Grid, Icon, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../../components/buttons/GoBackButton";
import Header from "../../../../components/Header";
import {storyTypeFormatter} from "../../../../util/formatterUtil";
import DownloadableFileList from "../../../../components/downloadableList/DownloadableFileList";
import {useNavigate, useParams} from "react-router-dom";
import {Area} from "../../../../types/area.types";
import {deleteArea, getAreaDetail} from "../../../../graphQL/Functions/area";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";
import {Warning} from "@mui/icons-material";
import CustomTextField from "../../../../components/fields/CustomTextField";
import {getSessionData} from "../../../../util/sessionDataUtil";
import AreaElementList from "./areaElementList/AreaElementList";
import DeleteArea from "../../../../components/DeleteArea";


interface OwnProps {}

type Props = OwnProps;

const AreaDetail: FunctionComponent<Props> = (props) => {

    const theme = useTheme();
    const apolloClient = useApolloClient()
    const {showSnackbar} = useContext(Context);
    const navigate = useNavigate();
    const {areaId} = useParams()

    const isAdmin = getSessionData()?.user.type === 'ADMIN_USER';

    const [areaDetail, setAreaDetail] = useState<Area>({
        id: '',
        name: '',
        story: 'FIRST',
        location: '',
        description: '',
        elementListing: [{id: '', name: '', location: ''}],
        imagesListing: [{id: '', name: '', source: '',}],
    });

    const handleDeleteArea = async (deleteConfirmation:string) : Promise<void> => {
        try {
            await deleteArea(apolloClient, areaDetail.id, deleteConfirmation, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    useEffect(() => {
        try {
            getAreaDetail(apolloClient, setAreaDetail, areaId as string)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])

    return (
        <Box>
            <GoBackButton/>
            <Header
                title={areaDetail.name}
                showFirstButton={isAdmin}
                firstButtonLabel={'Modificar área'}
                firstButtonNavigationRoute={'modify-area'}
                firstButtonParams={{
                    areaId: areaDetail.id,
                    areaName:areaDetail.name,
                    story: areaDetail.story,
                    location: areaDetail.location,
                    description: areaDetail.description,
                    files:areaDetail.imagesListing,
                }}
                showSecondButton={false}
            />
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Typography fontWeight='bold' color={theme.palette.primary.main} sx={{marginBottom:2}}>Área no. {areaDetail.id}</Typography>
                    <Grid container spacing={4} sx={{marginBottom:4}}>
                        <Grid item xs={4}>
                            <Typography fontWeight='bold'>Localización:<Typography>{storyTypeFormatter(areaDetail.story)}</Typography></Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography fontWeight='bold'>Ubicación exacta:<Typography>{areaDetail.location}</Typography></Typography>
                        </Grid>
                    </Grid>
                    <Typography fontWeight='bold' sx={{marginBottom:8}}>Descripción:<Typography>{areaDetail.description}</Typography></Typography>
                    <AreaElementList elements={areaDetail.elementListing}/>
                    {
                        isAdmin ?
                            <Box sx={{marginTop:8}}>
                                <DeleteArea
                                    title={'eliminar área'}
                                    disclaimer={'Esta acción es irreversible, borrará tanto el área como los elementos contenidos en la misma y las inspecciones asociadas. Tener precaución.'}
                                    confirmationText={'Eliminar area: ' + areaId}
                                    deleteHandler={handleDeleteArea}
                                />
                            </Box>
                        :
                            null
                    }

                </Grid>
                <Grid item xs={4}>
                    <Typography variant='h5' fontWeight='bold'>Imágenes del área</Typography>
                    <DownloadableFileList downloadableFileList={areaDetail.imagesListing}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AreaDetail;
