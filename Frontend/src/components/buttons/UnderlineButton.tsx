import {Button} from "@mui/material";
import {FunctionComponent} from "react";

interface OwnProps {
    label:string,
    action: () => void,
    buttonTextColor:string,
    buttonBackgroundColor:string,
}

type Props = OwnProps;

const CustomUnderlineButtonWhenHover: FunctionComponent<Props> = (props) => {
    return(
        <Button
            disableRipple
            variant='text'
            onClick={props.action}
            sx={{
                color: props.buttonTextColor,
                textTransform:'none',
                fontWeight:400,
                fontSize:'1rem',
                '&:hover' : {
                    textDecoration:'underline',
                    backgroundColor: props.buttonBackgroundColor,
                }
            }}
        >
            {props.label}
        </Button>
    );
};

export default CustomUnderlineButtonWhenHover;
