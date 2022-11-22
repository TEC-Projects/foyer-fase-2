import React, { FunctionComponent } from 'react';
import {Download} from "@mui/icons-material";
import {generateReport} from "../../util/pdfCreatorUtil";
import {Button} from "@mui/material";
import {Builder} from "../../util/reportBuilder/builder";

interface OwnProps {
    reportBuilder:Builder
}

type Props = OwnProps;

const DownloadReportButton: FunctionComponent<Props> = (props) => {

    return (
        <Button
          variant='outlined'
          sx={{height:56}}
          startIcon={<Download />}
          onClick={() => generateReport(props.reportBuilder)}
        >Descargar reporte PDF</Button>
    );
};

export default DownloadReportButton;
