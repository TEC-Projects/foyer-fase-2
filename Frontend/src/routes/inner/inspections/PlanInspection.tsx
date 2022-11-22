import React, {FunctionComponent, useContext, useState} from 'react';
import {Button, Grid, Stack, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import {PlanModifyInspection} from "../../../types/inspection.types";
import CustomDateField from "../../../components/fields/CustomDateField";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import CustomTextField from "../../../components/fields/CustomTextField";
import {planInspection} from "../../../graphQL/Functions/inspection";
import {useNavigate} from "react-router-dom";
import AreaSelector from "../../../components/selector/AreaSelector";
import ElementSelector from "../../../components/selector/ElementSelector";

interface OwnProps {}

type Props = OwnProps;

const PlanInspection: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)
    const navigate = useNavigate();

    const [newInspection, setNewInspection] = useState<PlanModifyInspection>({
        startDate: null,
        endDate: null,
        areaId: '',
        elementId: '',
        responsibleId: '',
    });

    const handleStartDateChange = (onChangeDate : Date | null) : void => {
        if(newInspection.endDate && newInspection.endDate < (onChangeDate as Date)){
            showSnackbar('Por favor ingresar una fecha de inicio anterior a la de fin', 'warning')
        }else{
            setNewInspection({
                ...newInspection,
                startDate: onChangeDate
            })
        }

    }

    const handleEndDateChange = (onChangeDate : Date | null) : void => {
        if(newInspection.startDate && newInspection.startDate > (onChangeDate as Date)){
            showSnackbar('Por favor ingresar una fecha de fin posterior a la de inicio', 'warning')
        }else{
            setNewInspection({
                ...newInspection,
                endDate: onChangeDate
            })
        }
    }

    const handleResponsibleIdChange = (onChangeId:string):void => {
        setNewInspection({
            ...newInspection,
            responsibleId:onChangeId,
        })
    }

    const handleAreaIdChange = (onChangeId:string):void => {
        setNewInspection({
            ...newInspection,
            areaId:onChangeId,
        })
    }

    const handleElementIdChange = (onChangeId:string):void => {
        setNewInspection({
            ...newInspection,
            elementId:onChangeId
        })
    }

    const handlePlanInspection = async () : Promise<void> => {
        try {
            await planInspection(apolloClient, newInspection, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Stack>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>PLANIFICAR INSPECCIÓN</Typography>
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <Stack gap={4}>
                        <AreaSelector label={'Área por inspeccionar'} value={newInspection.areaId as string} changeHandler={handleAreaIdChange}/>
                        <ElementSelector value={newInspection.elementId as string} parentAreaId={newInspection.areaId as string} changeHandler={handleElementIdChange}/>
                        <CustomDateField label={'Fecha de inicio'} value={newInspection.startDate} changeHandler={handleStartDateChange} maxDate={null} minDate={new Date()}/>
                        <CustomDateField label={'Fecha de fin'} value={newInspection.endDate} changeHandler={handleEndDateChange} maxDate={null} minDate={new Date()}/>
                        <CustomTextField label={'Identificación del encargado'} value={newInspection.responsibleId} changeHandler={handleResponsibleIdChange}/>
                        <Button
                            onClick={handlePlanInspection}
                            variant='contained'
                            sx={{
                                width:'100%',
                                paddingY: 2,
                            }}
                        >PLANIFICAR INSPECCIÓN</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default PlanInspection;
