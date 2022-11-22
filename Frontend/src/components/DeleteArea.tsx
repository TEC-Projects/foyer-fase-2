import React, {FunctionComponent, useState} from 'react';
import {Box, Button, Stack, Typography} from "@mui/material";
import {Warning} from "@mui/icons-material";
import CustomTextField from "./fields/CustomTextField";

interface OwnProps {
    title:string,
    disclaimer:string,
    confirmationText:string,
    deleteHandler: (deleteConfirmation:string) => void,
}

type Props = OwnProps;

const DeleteArea: FunctionComponent<Props> = (props) => {

    const [deleteConfirmation, setDeleteConfirmation] = useState<string>('');

    return (
        <Stack
            gap={2}
            sx={{
                padding:4,
                borderRadius:1,
                border:1,
                borderColor:'red',
            }}
        >
            <Box sx={{display:'flex', alignItems:'center'}}>
                <Warning sx={{color:'red', marginRight:2}} />
                <Typography variant='h5' fontWeight='bold' color='red'>Precaución: {props.title}</Typography>
            </Box>
            <Typography>{props.disclaimer}</Typography>
            <Typography fontWeight='bold'>Por favor digite en el cuadro de texto "{props.confirmationText}"</Typography>
            <CustomTextField label={'Confirmación'} value={deleteConfirmation} changeHandler={setDeleteConfirmation}/>
            <Button
                variant='outlined'
                color='error'
                sx={{height:56, width:'33.33%'}}
                onClick={() => props.deleteHandler(deleteConfirmation)}
            >{props.title}</Button>
        </Stack>
    );
};

export default DeleteArea;
