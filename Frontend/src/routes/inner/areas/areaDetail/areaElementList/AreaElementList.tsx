import React, { FunctionComponent } from 'react';
import {Box, Stack, Typography} from "@mui/material";
import {ElementListingItem} from "../../../../../types/area.types";
import AreaElementListItem from "./AreaElementListItem";
import EmptyListing from "../../../../../components/EmptyListing";

interface OwnProps {
    elements:Array<ElementListingItem>
}

type Props = OwnProps;

const AreaElementList: FunctionComponent<Props> = (props) => {

    return (
        <Stack gap={2}>
            <Typography variant='h5' fontWeight='bold'>Elementos del área</Typography>
            {
                props.elements.length ?
                    props.elements.map((element:ElementListingItem) => {
                        return <AreaElementListItem element={element}/>
                    })
                :
                    <EmptyListing emptyListingMessage={'Al parecer esta área no tiene elementos registrados.'}/>
            }
        </Stack>
    );
};

export default AreaElementList;
