import React, { FunctionComponent } from 'react';
import {Grid} from "@mui/material";
import EmptyListing from "../../../../components/EmptyListing";
import users from "../../users/Users";
import {InspectionListingItem} from "../../../../types/inspection.types";
import InspectionsListItem from "./InspectionsListItem";

interface OwnProps {
    inspections:Array<InspectionListingItem>
}

type Props = OwnProps;

const InspectionsList: FunctionComponent<Props> = (props) => {

    return (
        <Grid
            container
            spacing={4}
            sx={{marginTop:4}}
        >
            {
                users.length?
                    props.inspections.map((inspection:InspectionListingItem) => {
                        return <InspectionsListItem inspectionData={inspection}/>
                    })
                    :
                    <EmptyListing emptyListingMessage={'Al parecer no hay inspecciones registradas.'}/>
            }
        </Grid>
    );
};

export default InspectionsList;
