import {IconButton} from "@mui/material";
import {FunctionComponent} from "react";
import {Add} from "@mui/icons-material";

interface OwnProps {
    handleClick: () => void
}

type Props = OwnProps;

const AddButton: FunctionComponent<Props> = (props) => {

    return(
        <IconButton
            onClick={props.handleClick}
            disableRipple
            sx={{
                color:'black',
                backgroundColor:'#f1f1f1',
                '&:hover' : {
                    backgroundColor:'#f1f1f1',
                },
                width:50,
                marginBottom:2,
            }}
        >
            <Add fontSize='large'/>
        </IconButton>
    );
};

export default AddButton;
