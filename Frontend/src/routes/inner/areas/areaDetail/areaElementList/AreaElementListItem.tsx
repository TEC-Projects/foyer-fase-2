import React, { FunctionComponent } from 'react';
import {Box, Stack, Typography, useTheme} from "@mui/material";
import {ElementListingItem} from "../../../../../types/area.types";
import {Link} from "react-router-dom";

interface OwnProps {
    element:ElementListingItem
}

type Props = OwnProps;

const AreaElementListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    return (
        <Stack
            gap={2}
            sx={{
                backgroundColor:'#f1f1f1',
                padding:4,
                borderRadius:1,
            }}
        >
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                <Link to={'element/' + props.element.id} style={{ textDecoration: 'none', color:'black' }}>
                    <Typography variant='h5' fontWeight='bold' sx={{'&:hover':{textDecoration: 'underline'}}}>{props.element.name}</Typography>
                </Link>
                <Typography>{props.element.location}</Typography>
            </Box>
            <Typography fontWeight='bold' color={theme.palette.primary.main}>Elemento no. {props.element.id}</Typography>
        </Stack>
    );
};

export default AreaElementListItem;
