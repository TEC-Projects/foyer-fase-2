import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Grid, Stack} from "@mui/material";
import CustomTextArea from "../../../../components/fields/CustomTextArea";
import FileUploadList from "../../../../components/fileUploadList/FileUploadList";
import {DownloadableFile, SelectorItem, UploadableFile} from "../../../../types/common.types";
import RemoveButton from "../../../../components/buttons/RemoveButton";
import {Damage} from "../../../../types/inspection.types";
import GeneralTypeSelector from "../../../../components/selector/GeneralTypeSelector";
import {SpoilageAgent} from "../../../../types/spoilageAgent.types";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";


interface OwnProps {
    newDamageData:Damage,
    spoilageAgents:Array<SpoilageAgent>
    spoilageAgentChangeHandler: (onChangeName:string) => void,
    observationsChangeHandler: (onChangeLocation:string) => void,
    recommendationsChangeHandler: (onChangeDescription:string) => void,
    addImageChangeHandler: (onChangeImage:File | null) => void,
    removeImageChangeHandler: (onChangeImage:File | UploadableFile | DownloadableFile | null) => void,
    transactionDamageIdChangeHandler: (onChangeId:string) => void,
    removeDamageChangeHandler: (onChangeElementId:string) => void,
}

type Props = OwnProps;

const DamageForm: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context);

    const [spoilageAgentSelectorItems, setSpoilageAgentSelectorItems] = useState<Array<SelectorItem>>([{
        label:"",
        value: "",
    }]);

    useEffect(() => {
        let selectorSpoilageAgentList:Array<SelectorItem> = []
        props.spoilageAgents.forEach((spoilageAgent:SpoilageAgent) => {
            selectorSpoilageAgentList.push({label:spoilageAgent.name, value:spoilageAgent.id})
        })
        setSpoilageAgentSelectorItems(selectorSpoilageAgentList)
    }, [props.spoilageAgents]);


    return (
        <Stack
            direction='row'
            gap={4}
            sx={{
                backgroundColor:'#f1f1f1',
                padding:4,
                borderRadius:1,
            }}
        >
            <RemoveButton handleClick={() => props.removeDamageChangeHandler(props.newDamageData.id)} backgroundColor={'#f1f1f1'}/>
            <Box sx={{flex:1}}>
                <Grid container spacing={4}>
                    <Grid item xs={4} sx={{marginBottom:4}}>
                       <GeneralTypeSelector
                           label={'Agente de deterioro identificado'}
                           value={props.newDamageData.spoilageAgentId}
                           itemCollection={spoilageAgentSelectorItems}
                           changeHandler={props.spoilageAgentChangeHandler}
                           isElementField={true}
                           globalIdChangeHandler={props.transactionDamageIdChangeHandler}
                           currentId={props.newDamageData.id}
                       />
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <CustomTextArea
                            label={'Observaciones'}
                            value={props.newDamageData.observations}
                            changeHandler={props.observationsChangeHandler}
                            isElementField={true}
                            globalIdChangeHandler={props.transactionDamageIdChangeHandler}
                            currentId={parseInt(props.newDamageData.id)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextArea
                            label={'Recomendaciones de tratamiento'}
                            value={props.newDamageData.recommendations}
                            changeHandler={props.recommendationsChangeHandler}
                            isElementField={true}
                            globalIdChangeHandler={props.transactionDamageIdChangeHandler}
                            currentId={parseInt(props.newDamageData.id)}
                        />
                    </Grid>
                    <Grid item xs={4} sx={{marginTop:1}}>
                        <FileUploadList
                            label={"Imágen de hallazgo (opcional)"}
                            uploadFileType={'image/png, image/jpg, image/jpeg'}
                            maxUploadCount={1}
                            fileList={props.newDamageData.image}
                            addChangeHandler={props.addImageChangeHandler}
                            removeChangeHandler={props.removeImageChangeHandler}
                            globalIdChangeHandler={props.transactionDamageIdChangeHandler}
                            currentElementId={parseInt(props.newDamageData.id)}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Stack>
    );
};

export default DamageForm;
