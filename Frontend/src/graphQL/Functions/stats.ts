import {ApolloClient} from "@apollo/client";
import {allInspectionsStatsByStatus, responsibleInspectionsStatsByStatus} from "../../dummyData/statsDummyData";
import {validateResponsibleId} from "../../util/validatorUtil";
import {chartDataFormatter} from "../../util/formatterUtil";
import {GET_ALL_STATS, GET_STATS_BY_RESPONSIBLE} from "../Queries/statsQueries";


/**
 * Function that retrieves all inspection statistics by its status.
 */
const getAllInspectionsStatsByStatus = async (apolloClient:ApolloClient<any>, setState:Function, colorProfile:Array<string>):Promise<void> => {
    const {data} = await apolloClient.mutate({
        mutation: GET_ALL_STATS,
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');

    if(data.getSupervisionsStatistics.response){
        throw new Error(data.getSupervisionsStatistics.message);
    }

    setState(chartDataFormatter(data.getSupervisionsStatistics, colorProfile));
};

/**
 * Function that retrieves all inspection statistics by its status.
 */
const getResponsibleInspectionsStatsByStatus = async (apolloClient:ApolloClient<any>, setChartDataState:Function, setResponsibleState:Function, responsibleId:string, colorProfile:Array<string>):Promise<void> => {
    validateResponsibleId(responsibleId);
    const {data} = await apolloClient.mutate({
        mutation: GET_STATS_BY_RESPONSIBLE,
        variables: {
            responsibleId
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');


    if(data.getSupervisionsStatisticsFromResponsible.response){
        throw new Error(data.getSupervisionsStatisticsFromResponsible.message);
    }

    setChartDataState(chartDataFormatter(data.getSupervisionsStatisticsFromResponsible.dataset, colorProfile));
    setResponsibleState(data.getSupervisionsStatisticsFromResponsible.responsible);
};

export{
    getAllInspectionsStatsByStatus,
    getResponsibleInspectionsStatsByStatus,
}
