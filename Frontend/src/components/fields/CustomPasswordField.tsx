import React, {FunctionComponent, useState} from 'react';
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

interface OwnProps {
    label:string,
    value:string,
    changeHandler:Function,
}

type Props = OwnProps;

const CustomPasswordField: FunctionComponent<Props> = (props) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl
            variant="outlined"
            sx={{
                my:1,
                width:'100%',
                '& label.Mui-focused': {
                    color: '#606060',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#606060',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        fontColor:'#b4b4b4',
                        borderColor: '#b4b4b4',
                    },
                    '&:hover fieldset': {
                        fontColor:'#b4b4b4',
                        borderColor: '#b4b4b4',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#b4b4b4',
                    },
                },
            }}>
            <InputLabel htmlFor="outlined-adornment-password">{props.label}</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={props.value}
                onChange={(e) => props.changeHandler(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={props.label}
            />
        </FormControl>
    );
};

export default CustomPasswordField;
