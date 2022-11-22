import {Button, IconButton} from "@mui/material";
import {FunctionComponent} from "react";
import {ArrowBack} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

interface OwnProps {
}

type Props = OwnProps;

const GoBackButton: FunctionComponent<Props> = (props) => {

    const navigate = useNavigate();

    return(
        <IconButton
            onClick={() => navigate(-1)}
            disableRipple
            sx={{
                color:'black',
                '&:hover' : {
                    backgroundColor:'white',
                },
                width:50,
                marginBottom:4,
            }}
        >
            <ArrowBack fontSize='large'/>
        </IconButton>
    );
};

export default GoBackButton;
