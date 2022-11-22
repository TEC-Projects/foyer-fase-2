import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import Header from "../../../components/Header";
import {Box, Button, Grid, Stack, Typography, useTheme} from "@mui/material";
import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {getAllInspectionsStatsByStatus, getResponsibleInspectionsStatsByStatus} from "../../../graphQL/Functions/stats";
import { purple, deepOrange, green, blue ,grey} from '@mui/material/colors';
import CustomTextField from "../../../components/fields/CustomTextField";
import {planInspection} from "../../../graphQL/Functions/inspection";
import { Responsible } from '../../../types/responsible.types';
import {personnelTypeFormatter, roleListFormatter} from "../../../util/formatterUtil";
import EmptyListing from "../../../components/EmptyListing";

interface OwnProps {}

type Props = OwnProps;

const Stats: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const theme = useTheme();

    const {showSnackbar} = useContext(Context);

    ChartJS.register(ArcElement, Tooltip, Legend);

    const chartColors =  [
        theme.palette.primary.main,
        purple[500],
        deepOrange[500],
        green[500],
        blue[500],
    ];

    const chartOptions: ChartOptions = {
        plugins: {
            legend: {
                position:'right',
                labels:{
                    padding:50,
                }
            }
        },
        maintainAspectRatio: false,
        responsive: false,
    }


    const [allInspectionsChartData, setAllInspectionsChartData] = useState({
        labels:['Sin datos por mostrar'],
        datasets: [{
            label: 'Estadísticas de inspecciones según estado.',
            data: [1],
            backgroundColor: [grey[400]],
        },],
    });

    const [responsibleInspectionsChartData, setResponsibleInspectionsChartData] = useState({
        labels:['Sin datos por mostrar'],
        datasets: [{
            label: 'Estadísticas de inspecciones según estado.',
            data: [1],
            backgroundColor: [grey[400]],
        },],
    });

    const [responsibleDetail, setResponsibleDetail] = useState<Responsible>({
        id: '',
        user: {
            id: '',
            name: '',
            surname: '',
            type: 'OPERATIVE_USER',
            email: '',
        },
        type: 'INTERNAL',
        role: ['RESTORATION'],
    });

    const [responsibleId, setResponsibleId] = useState("");

    const [showResponsibleStatsChart, setShowResponsibleStatsChart] = useState<boolean>(true);

    const responsibleIdChangeHandler = (onChangeId:string) : void => {
        setResponsibleId(onChangeId)
    }

    const handleResponsibleIdFilter = async () : Promise<void> => {
        try {
            await getResponsibleInspectionsStatsByStatus(apolloClient, setResponsibleInspectionsChartData, setResponsibleDetail, responsibleId,  chartColors)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    useEffect(() => {
        getAllInspectionsStatsByStatus(apolloClient, setAllInspectionsChartData, chartColors).catch((e : unknown) => {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        })

    }, [])

    useEffect(() => {
        const responsibleTotalAbsoluteCount = responsibleInspectionsChartData.datasets[0].data.reduce((partialSum, a) => partialSum + a, 0);
        if(responsibleTotalAbsoluteCount < 1){
            setShowResponsibleStatsChart(false);
        }else{
            setShowResponsibleStatsChart(true);
        }
    }, [responsibleInspectionsChartData])


    return (
      <Stack>
          <Header
              title={'ESTADÍSTICAS'}
              showFirstButton={false}
              showSecondButton={false}
          />
          <Grid container spacing={4} alignItems={"start"}>
              <Grid item xs={6} justifyContent="center">
                  <Typography variant='h5' fontWeight='bold'>Todas las inspecciones según su estado</Typography>
                  <Box>
                      <Doughnut width={650} height={500} data={allInspectionsChartData} options={chartOptions}/>
                  </Box>
              </Grid>
              <Grid item xs={6} >
                  <Typography variant='h5' fontWeight='bold'>Inspecciones de un encargado según su estado</Typography>
                  {
                      showResponsibleStatsChart ?
                          <Box>
                              <Doughnut width={650} height={500} data ={responsibleInspectionsChartData} options={chartOptions}/>
                          </Box>
                      :
                          <Box width={650} height={500} sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                              <EmptyListing emptyListingMessage={"Al parecer el encargado no cuenta con inspecciones asociadas."}/>
                          </Box>
                  }

                  {
                      responsibleDetail.id.length ?
                          <Box sx={{
                              backgroundColor:'#f1f1f1',
                              borderRadius:1,
                              padding:4,
                              mb:4,
                          }}>
                              <Stack direction="row" gap={1} sx={{mb:1}}>
                                  <Typography fontWeight='bold'>{responsibleDetail.user.name + " " + responsibleDetail.user.surname} </Typography>
                                  <Typography color={theme.palette.primary.main}>{personnelTypeFormatter(responsibleDetail.type)}</Typography>
                              </Stack>
                              <Typography>Identificación: {responsibleDetail.id}</Typography>
                              <Typography>Roles: {roleListFormatter(responsibleDetail.role)}</Typography>
                              {
                                  responsibleDetail.type === 'CONTRACTOR' ? <Typography>Empresa: {responsibleDetail.companyName}</Typography> : null
                              }
                          </Box>
                      :
                        null
                  }
                  <Stack direction="row" gap={4} sx={{alignItems:'center'}}>
                      <CustomTextField value={responsibleId} label={'Id. de encargado'} changeHandler={responsibleIdChangeHandler}/>
                      <Button
                          onClick={handleResponsibleIdFilter}
                          variant='contained'
                          sx={{height:56, px:5}}
                      >Filtrar</Button>
                  </Stack>
              </Grid>
          </Grid>

      </Stack>
    );
};

export default Stats;
