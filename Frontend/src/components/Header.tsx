import React, { FunctionComponent } from 'react';
import {Button, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface OwnProps {
    title:string,
    firstButtonLabel?:string,
    firstButtonNavigationRoute?:string,
    firstButtonParams?:any,
    firstButtonStyle?:any,
    secondButtonLabel?:string,
    secondButtonNavigationRoute?:string,
    secondButtonParams?:any,
    secondButtonStyle?:any,
    showFirstButton:boolean
    showSecondButton:boolean
}

type Props = OwnProps;

const Header: FunctionComponent<Props> = (props) => {

    const navigate = useNavigate();

    const titleGridSize = (props.showFirstButton || props.showSecondButton) ? 4 : 12

    return (
        <Grid
            container
            spacing={4}
            sx={{
                marginBottom:8,
                justifyContent:'space-between',
            }}
        >
            <Grid
                item
                xs={titleGridSize}
            >
                <Typography variant='h4' fontWeight='bold'>{props.title}</Typography>
            </Grid>
            {
                props.showSecondButton ?
                    <Grid
                        item
                        xs={4}
                    >

                                <Button
                                    onClick={() => navigate(
                                        props.secondButtonNavigationRoute ? props.secondButtonNavigationRoute : '',
                                        {state:props.secondButtonParams}
                                    )}
                                    variant={props.secondButtonStyle != null ? props.secondButtonStyle : 'contained'}
                                    sx={{
                                        width:'100%',
                                        height:'100%'
                                    }}
                                >{props.secondButtonLabel}</Button>

                    </Grid>
                :
                    null
            }
            {
                props.showFirstButton ?
                    <Grid
                        item
                        xs={4}
                    >

                        <Button
                            onClick={() => navigate(
                                props.firstButtonNavigationRoute ? props.firstButtonNavigationRoute : '',
                                {state:props.firstButtonParams}
                            )}
                            variant={props.firstButtonStyle != null ? props.firstButtonStyle : 'contained'}
                            sx={{
                                width:'100%',
                                height:'100%'
                            }}
                        >{props.firstButtonLabel}</Button>

                    </Grid>
                :
                    null
            }

        </Grid>
    );
};

export default Header;
