import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import {getSessionData} from "../../../util/sessionDataUtil";
import SpoilageAgentsList from "./spoilageAgentsList/SpoilageAgentsList";
import Header from "../../../components/Header";
import DownloadReportButton from "../../../components/buttons/DownloadReportButton";
import {SpoilageAgentReportBuilder} from "../../../util/reportBuilder/builder";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {SpoilageAgent} from "../../../types/spoilageAgent.types";
import {getSpoilageAgentsListing} from "../../../graphQL/Functions/spoilageAgent";


interface OwnProps {}

type Props = OwnProps;

const SpoilageAgents: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)

    const [spoilageAgents, setSpoilageAgents] = useState<Array<SpoilageAgent>>([]);

    const showButton : boolean = getSessionData()?.user.type === 'ADMIN_USER';
    const reportBuilder: SpoilageAgentReportBuilder = new SpoilageAgentReportBuilder(spoilageAgents)


    useEffect(() => {
        getSpoilageAgentsListing(apolloClient, setSpoilageAgents).catch((e : unknown) => {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        })
    }, [])

    return (
        <Box>
            <Header title={'AGENTES DE DETERIORO'} firstButtonLabel={'MODIFICAR AGENTES DE DETERIORO'} firstButtonNavigationRoute={'modify-spoilage-agents'}  showFirstButton={showButton} showSecondButton={false}/>
            <Box
                sx={{marginBottom:4}}
            >
                <DownloadReportButton reportBuilder={reportBuilder}/>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Typography variant='h5' fontWeight='bold' sx={{marginBottom:4}}>Agentes naturales</Typography>
                    <SpoilageAgentsList type={'NATURAL'} spoilageAgents={spoilageAgents}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='h5' fontWeight='bold' sx={{marginBottom:4}}>Agentes circunstanciales</Typography>
                    <SpoilageAgentsList type={'CIRCUMSTANTIAL'} spoilageAgents={spoilageAgents}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SpoilageAgents;
