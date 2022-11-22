import React, { FunctionComponent } from 'react';
import {Box, Grid, Stack, Typography, useTheme} from "@mui/material";
import {AreaListingItem} from "../../../../types/area.types";
import {storyTypeFormatter} from "../../../../util/formatterUtil";
import {Link} from "react-router-dom";

interface OwnProps {
    areaData:AreaListingItem
}

type Props = OwnProps;

const AreasListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    return (
        <Grid item xs={4}>
            <Stack
                sx={{
                    backgroundColor:'#f1f1f1',
                    padding:4,
                    borderRadius:1,
                }}
            >
                <Stack sx={{marginBottom:2}}>
                    <Box
                        sx={{
                            display:'flex',
                            justifyContent:'space-between'
                        }}
                    >
                        <Link to={props.areaData.id} style={{ textDecoration: 'none', color:'black' }}>
                            <Typography variant='h5' fontWeight='bold' sx={{'&:hover':{textDecoration: 'underline'}}}>{props.areaData.name}</Typography>
                        </Link>
                        <Typography>{storyTypeFormatter(props.areaData.story)}</Typography>
                    </Box>
                    <Typography fontWeight='bold' color={theme.palette.primary.main}>Área no. {props.areaData.id}</Typography>
                </Stack>
                <Typography>Cantidad de elementos: {props.areaData.elementCount}</Typography>
            </Stack>
        </Grid>
    );
};

export default AreasListItem;
