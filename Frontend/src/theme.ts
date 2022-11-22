import { createTheme } from '@mui/material/styles';
import {esES} from "@mui/material/locale";

// A custom theme for this app
const theme = createTheme({
    palette: {
        primary: {
            main: '#daa520',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#000000',
        },
    },
}, esES);

theme.components = {
    MuiButton: { // `MuiButton` is the global class name for the <Button /> component
        defaultProps : {
            disableElevation: true, // this prop disables the drop shadow on all Buttons
        }
    },
};

export default theme;
