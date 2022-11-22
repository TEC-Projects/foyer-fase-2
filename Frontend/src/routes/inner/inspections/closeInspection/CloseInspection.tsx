import React, {FunctionComponent} from 'react';
import {Stack, Typography} from "@mui/material";
import GoBackButton from "../../../../components/buttons/GoBackButton";
import AdminCloseInspectionForm from "./AdminCloseInspectionForm";
import OperativeCloseInspectionForm from "./OperativeCloseInspectionForm";
import {getSessionData} from "../../../../util/sessionDataUtil";
import {useLocation} from "react-router-dom";

interface OwnProps {}

type Props = OwnProps;

const CloseInspection: FunctionComponent<Props> = (props) => {

    const isAdmin : boolean = getSessionData()?.user.type === 'ADMIN_USER';
    const location = useLocation()

    return (
        <Stack>

            <GoBackButton/>
            {
                isAdmin ?
                    <AdminCloseInspectionForm inspectionDetail={location.state.inspectionDetail}/>
                :
                    <OperativeCloseInspectionForm inspectionDetail={location.state.inspectionDetail}/>
            }
        </Stack>
    );
};

export default CloseInspection;
