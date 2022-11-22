import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Button, Grid, Stack, Typography, useTheme} from "@mui/material";
import {toBeInspectedTypeFormatter} from "../../../../util/formatterUtil";
import {ToBeInspected} from "../../../../types/area.types";
import SuggestedActionSelector from "../../../../components/selector/SuggestedActionSelector";
import {Actions, OperativeCloseInspection, Inspection, Damage} from "../../../../types/inspection.types";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";
import {useNavigate} from "react-router-dom";
import {
    getCloseInspectionDraft,
    operativeCloseInspection,
    operativeSaveInspectionDraft
} from "../../../../graphQL/Functions/inspection";
import EmptyListing from "../../../../components/EmptyListing";
import {Add} from "@mui/icons-material";
import {DownloadableFile, UploadableFile} from "../../../../types/common.types";
import DamageForm from "./DamageForm";
import Header from "../../../../components/Header";
import {getSpoilageAgentsListing} from "../../../../graphQL/Functions/spoilageAgent";
import {SpoilageAgent} from "../../../../types/spoilageAgent.types";

interface OwnProps {
    inspectionDetail : Inspection,
}

type Props = OwnProps;

const OperativeCloseInspectionForm: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)
    const navigate = useNavigate();
    const theme = useTheme();

    const permittedFileFormat = ['image/png', 'image/jpg', 'image/jpeg']

    const [closeInspection, setCloseInspection] = useState<OperativeCloseInspection>({
        id:"",
        suggestedAction: "",
        damageListing:[{
            id:"0",
            serverId:"",
            spoilageAgentId:"",
            observations:"",
            recommendations:"",
            image:[],
            hasImageBeenRemoved:false,
            hasBeenCreated:true,
            hasBeenUpdated:false,
            hasBeenDeleted:false,
        }],
    });

    const [onChangeDamageId, setOnChangeDamageId] = useState<string>("0");

    const [spoilageAgents, setSpoilageAgents] = useState<Array<SpoilageAgent>>([{
        id: "",
        name:"",
        type: "NATURAL",
    }]);

    const suggestedActionChangeHandler = (actionOnChange : Actions | string) : void => {
        setCloseInspection({
            ...closeInspection,
            suggestedAction: actionOnChange,
        })
    }

    useEffect(() => {
        setCloseInspection({
            ...closeInspection,
            id: props.inspectionDetail.id
        })
    }, [props.inspectionDetail]);

    const handleAddDamage = (): void => {
        const newDamageListing:Array<Damage> = closeInspection.damageListing;
        let lastDamageId: string | undefined = closeInspection.damageListing[closeInspection.damageListing.length - 1]?.id
        const newDamageId: string = closeInspection.damageListing.length ? (parseInt(lastDamageId) + 1).toString() : "0"

        const newDamage = {
            id: newDamageId,
            spoilageAgentId: "",
            observations: "",
            recommendations: "",
            image: [],
            hasBeenCreated: true,
            hasBeenUpdated: false,
            hasBeenDeleted: false,
        }

        newDamageListing.push(newDamage)

        setCloseInspection({
            ...closeInspection,
            damageListing: newDamageListing,
        })
    }

    const handleRemoveDamage = (onChangeDamageId:string): void => {
        closeInspection.damageListing.forEach((damage:Damage, index:number) => {
            if(damage.id == onChangeDamageId){
                if(damage.hasBeenCreated){
                    setCloseInspection({
                        ...closeInspection,
                        damageListing: [
                            ...closeInspection.damageListing.slice(0,index),
                            ...closeInspection.damageListing.slice(index+1)
                        ]
                    })
                }else{
                    setCloseInspection({
                        ...closeInspection,
                        damageListing: [
                            ...closeInspection.damageListing.slice(0,index),
                            {
                                ...closeInspection.damageListing[index],
                                hasBeenDeleted:true,
                            },
                            ...closeInspection.damageListing.slice(index+1)
                        ]
                    })
                }
            }
        })
    }

    const handleDamageSpoilageAgentChange = (onChangeDamageSpoilageAgentId:string) : void => {

        closeInspection.damageListing.forEach((damage:Damage, index:number) => {
            if(damage.id == onChangeDamageId){
                setCloseInspection({
                    ...closeInspection,
                    damageListing: [
                        ...closeInspection.damageListing.slice(0,index),
                        {
                            ...closeInspection.damageListing[index],
                            hasBeenUpdated: !damage.hasBeenCreated,
                            spoilageAgentId:onChangeDamageSpoilageAgentId.toString(),
                        },
                        ...closeInspection.damageListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleDamageObservationsChange = (onChangeDamageObservations:string) : void => {
        closeInspection.damageListing.forEach((damage:Damage, index:number) => {
            if(damage.id == onChangeDamageId){
                setCloseInspection({
                    ...closeInspection,
                    damageListing: [
                        ...closeInspection.damageListing.slice(0,index),
                        {
                            ...closeInspection.damageListing[index],
                            hasBeenUpdated: !damage.hasBeenCreated,
                            observations:onChangeDamageObservations,
                        },
                        ...closeInspection.damageListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleDamageRecommendationsChange = (onChangeDamageRecommendations:string) : void => {
        closeInspection.damageListing.forEach((damage:Damage, index:number) => {
            if(damage.id == onChangeDamageId){
                setCloseInspection({
                    ...closeInspection,
                    damageListing: [
                        ...closeInspection.damageListing.slice(0,index),
                        {
                            ...closeInspection.damageListing[index],
                            hasBeenUpdated: !damage.hasBeenCreated,
                            recommendations:onChangeDamageRecommendations,
                        },
                        ...closeInspection.damageListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleAddDamageImage = (onChangeImage:File | null) : void => {
        if(permittedFileFormat.includes(onChangeImage?.type as string)){
            closeInspection.damageListing.forEach((damage:Damage, index:number) => {
                if(damage.id == onChangeDamageId){
                    setCloseInspection({
                        ...closeInspection,
                        damageListing: [
                            ...closeInspection.damageListing.slice(0,index),
                            {
                                ...closeInspection.damageListing[index],
                                image:[onChangeImage],
                                hasBeenUpdated: !damage.hasBeenCreated,
                                hasImageBeenRemoved:false,
                            },
                            ...closeInspection.damageListing.slice(index+1)
                        ]
                    })
                }
            })
        }else{
            showSnackbar('Por favor adjunte un archivo de formato de imagen',  'warning')
        }
    }

    const handleRemoveDamageImage = (onChangeImage:File | UploadableFile | DownloadableFile | null): void => {
        closeInspection.damageListing.forEach((damage:Damage, index:number) => {
            if(damage.id == onChangeDamageId){
                setCloseInspection({
                    ...closeInspection,
                    damageListing: [
                        ...closeInspection.damageListing.slice(0,index),
                        {
                            ...closeInspection.damageListing[index],
                            image:[],
                            hasBeenUpdated: !damage.hasBeenCreated,
                            hasImageBeenRemoved:true,
                        },
                        ...closeInspection.damageListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const generateChangeLists = () => {
        return ({
            createdDamages: closeInspection.damageListing.filter(damage => damage.hasBeenCreated),
            updatedDamages: closeInspection.damageListing.filter(damage => damage.hasBeenUpdated),
            deletedDamages: closeInspection.damageListing.filter(damage => damage.hasBeenDeleted),
        });
    }

    const handleCloseInspection = async () : Promise<void> => {
        try {
            const {createdDamages, updatedDamages, deletedDamages} = generateChangeLists();
            await handleSaveInspectionDraft();
            await operativeCloseInspection(apolloClient, closeInspection, createdDamages, updatedDamages, deletedDamages, props.inspectionDetail.toBeInspected, spoilageAgents,  navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    const handleSaveInspectionDraft = async () : Promise<void> => {
        try {
            const {createdDamages, updatedDamages, deletedDamages} = generateChangeLists();
            await operativeSaveInspectionDraft(apolloClient, closeInspection, createdDamages, updatedDamages, deletedDamages, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    useEffect(() => {
        getCloseInspectionDraft(apolloClient, props.inspectionDetail.id, setCloseInspection, showSnackbar)
    }, []);

    useEffect(() => {
        try {
            getSpoilageAgentsListing(apolloClient, setSpoilageAgents)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])

    return (
        <Stack>
            <Grid
                container
                spacing={4}
                sx={{
                    marginBottom:4,
                    justifyContent:'space-between',
                }}
            >
                <Grid item xs={4}>
                    <Typography variant='h4' fontWeight='bold' marginBottom={4}>FINALIZAR INSPECCIÓN</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        onClick={handleCloseInspection}
                        variant='contained'
                        sx={{
                            width:'100%',
                            height:42
                        }}
                    >FINALIZAR INSPECCIÓN</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        onClick={handleSaveInspectionDraft}
                        variant='outlined'
                        sx={{
                            width:'100%',
                            height:42
                        }}
                    >GUARDAR BORRADOR</Button>
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant='h6' fontWeight='bold'>Inspección No. {props.inspectionDetail.id}</Typography>
                            <Typography fontWeight='bold' color={theme.palette.primary.main}>{toBeInspectedTypeFormatter(props.inspectionDetail.toBeInspected?.type as ToBeInspected) + ': ' + props.inspectionDetail.toBeInspected?.name}</Typography>
                        </Stack>
                        <SuggestedActionSelector value={closeInspection.suggestedAction} changeHandler={suggestedActionChangeHandler}/>
                    </Stack>
                </Grid>
            </Grid>
            <Stack gap={4} sx={{my:4}}>
                <Typography variant='h5' fontWeight='bold'>Agregar registro de daños al reporte</Typography>
                {
                    closeInspection.damageListing.length?
                        closeInspection.damageListing.filter((damage => !damage.hasBeenDeleted)).map((damage) => {
                            return (
                                <DamageForm
                                    newDamageData={damage}
                                    spoilageAgents={spoilageAgents}
                                    spoilageAgentChangeHandler={handleDamageSpoilageAgentChange}
                                    observationsChangeHandler={handleDamageObservationsChange}
                                    recommendationsChangeHandler={handleDamageRecommendationsChange}
                                    addImageChangeHandler={handleAddDamageImage}
                                    removeImageChangeHandler={handleRemoveDamageImage}
                                    removeDamageChangeHandler={handleRemoveDamage}
                                    transactionDamageIdChangeHandler={setOnChangeDamageId}
                                />
                            )
                        })
                        :
                        <EmptyListing emptyListingMessage={'Al parecer no hay daños registrados en la inspección. Utiliza el botón de abajo para agregar nuevos.'}/>
                }
                <Button
                    variant='outlined'
                    startIcon={<Add/>}
                    sx={{width:'30%', alignSelf:'center'}}
                    onClick={handleAddDamage}
                >Agregar registro de daño</Button>
            </Stack>
        </Stack>

    );
};

export default OperativeCloseInspectionForm;
