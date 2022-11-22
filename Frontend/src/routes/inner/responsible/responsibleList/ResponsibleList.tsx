import React, { FunctionComponent } from 'react';
import {Stack} from "@mui/material";
import {Responsible} from "../../../../types/responsible.types";
import ResponsibleListItem from "./ResponsibleListItem";
import EmptyListing from "../../../../components/EmptyListing";

interface OwnProps {
    responsibleList:Array<Responsible>
}

type Props = OwnProps;

const ResponsibleList: FunctionComponent<Props> = (props) => {

    return (
        <Stack
            gap={4}
        >
            {
                props.responsibleList.length ?
                    props.responsibleList.map((responsible:Responsible) => {
                        return(<ResponsibleListItem responsibleData={responsible}/>);
                    } )
                    :
                    <EmptyListing emptyListingMessage={'Al parecer no hay encargados registrados'}/>
            }
        </Stack>
    );
};

export default ResponsibleList;
