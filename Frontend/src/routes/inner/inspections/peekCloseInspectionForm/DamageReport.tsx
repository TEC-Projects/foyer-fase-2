import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Typography, Stack, Grid, Box} from "@mui/material";
import {Actions, Damage} from "../../../../types/inspection.types";
import {SpoilageAgent} from "../../../../types/spoilageAgent.types";
import {getSpoilageAgentsListing} from "../../../../graphQL/Functions/spoilageAgent";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";
import DownloadableFileList from "../../../../components/downloadableList/DownloadableFileList";
import {DownloadableFile} from "../../../../types/common.types";

interface OwnProps {
    damage:Damage,
}

type Props = OwnProps;

const DamageReport: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)

    const [spoilageAgents, setSpoilageAgents] = useState<Array<SpoilageAgent>>([]);

    const [foundSpoilageAgent, setFoundSpoilageAgent] = useState<string>("");

    useEffect(() => {
        try {
            getSpoilageAgentsListing(apolloClient, setSpoilageAgents);
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])

    useEffect(() => {
        if(spoilageAgents){
            spoilageAgents.forEach(spoilageAgent => {
                if(spoilageAgent.id == props.damage.spoilageAgentId){
                    setFoundSpoilageAgent(spoilageAgent.name)
                }
            })
        }
    }, [spoilageAgents])


  return (
      <Stack sx={{
          backgroundColor:'#f1f1f1',
          borderRadius:1,
          padding:4,
      }}>
          <Typography fontWeight='bold'>Agente de deterioro:<Typography>{foundSpoilageAgent}</Typography></Typography>
          <Box sx={{flex:1}} mt={2}>
              <Grid container spacing={4}>
                  <Grid item xs={4}>
                      <Typography fontWeight='bold'>Observaciones:<Typography>{props.damage.observations}</Typography></Typography>
                  </Grid>
                  <Grid item xs={4}>
                      <Typography fontWeight='bold'>Recomendaciones:<Typography>{props.damage.recommendations}</Typography></Typography>
                  </Grid>
                  <Grid item xs={4}>
                      <Typography fontWeight='bold'>Imágen de hallazgo:</Typography>
                          {
                              props.damage.image.length ?
                                  <Box mt={-4} mb={-2} ml={-2}>
                                      <DownloadableFileList downloadableFileList={props.damage.image as Array<DownloadableFile>}/>
                                  </Box>
                                :
                                  <Typography>Al parecer no fueron aportadas imágenes del hallazgo.</Typography>
                          }
                  </Grid>
              </Grid>
          </Box>
      </Stack>
  );
};

export default DamageReport;
