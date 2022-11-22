import React, { FunctionComponent } from 'react';
import {Checkbox, FormControlLabel, Stack, Typography} from "@mui/material";

interface OwnProps {
    inspectorValue:boolean,
    inspectorChangeHandler: () => void,
    curatorValue:boolean,
    curatorChangeHandler: () => void,
    restorerValue:boolean,
    restorerChangeHandler: () => void,
}

type Props = OwnProps;

const ResponsibleCheckBox: FunctionComponent<Props> = (props) => {

    return (
        <Stack>
            <Typography>Rol</Typography>
            <Stack
                gap={2}
                direction='row'
            >
                <FormControlLabel control={
                    <Checkbox
                        checked={props.inspectorValue}
                        onChange={props.inspectorChangeHandler}
                    />
                } label="Inspector" />

                <FormControlLabel control={
                    <Checkbox
                        checked={props.curatorValue}
                        onChange={props.curatorChangeHandler}

                    />
                } label="Conservador" />

                <FormControlLabel control={
                    <Checkbox
                        checked={props.restorerValue}
                        onChange={props.restorerChangeHandler}

                    />
                } label="Restaurador" />
            </Stack>
        </Stack>
    );
};

export default ResponsibleCheckBox;
