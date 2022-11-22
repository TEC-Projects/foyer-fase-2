import {IconButton} from "@mui/material";
import {FunctionComponent} from "react";
import {Add, RemoveCircleOutline} from "@mui/icons-material";

interface OwnProps {
    handleClick: () => void,
    backgroundColor:string,
}

type Props = OwnProps;

const RemoveButton: FunctionComponent<Props> = (props) => {

    return(
        <IconButton
            onClick={props.handleClick}
            disableRipple
            sx={{
                backgroundColor:props.backgroundColor,
                '&:hover' : {
                    backgroundColor:props.backgroundColor,
                },
                padding:0,
                marginBottom:2,
            }}
        >
            <RemoveCircleOutline fontSize='medium' sx={{color:'#d40000'}}/>
        </IconButton>
    );
};

export default RemoveButton;
