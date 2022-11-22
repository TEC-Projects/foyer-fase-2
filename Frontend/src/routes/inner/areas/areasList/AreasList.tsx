import React, { FunctionComponent } from 'react';
import {Grid} from "@mui/material";
import users from "../../users/Users";
import EmptyListing from "../../../../components/EmptyListing";
import {AreaListingItem} from "../../../../types/area.types";
import AreasListItem from "./AreasListItem";

interface OwnProps {
    areas:Array<AreaListingItem>
}

type Props = OwnProps;

const AreasList: FunctionComponent<Props> = (props) => {

    return (
        <Grid
            container
            spacing={4}
            sx={{marginTop:4}}
        >
            {
                users.length?
                    props.areas.map((area:AreaListingItem) => {
                        return <AreasListItem areaData={area}/>
                    })
                    :
                    <EmptyListing emptyListingMessage={'Al parecer no hay inspecciones registradas.'}/>
            }
        </Grid>
    );
};

export default AreasList;
