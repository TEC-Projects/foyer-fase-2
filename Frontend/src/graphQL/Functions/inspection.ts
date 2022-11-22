import {ApolloClient} from "@apollo/client";
import {
    validateAdminCloseInspection,
    validateInspectionFilters,
    validateModifyInspection, validateOperativeCloseInspection,
    validatePlanInspection,
} from "../../util/validatorUtil";
import {
    AdminCloseInspection, Damage,
    InspectionFilters,
    OperativeCloseInspection,
    PlanModifyInspection
} from "../../types/inspection.types";
import {
    CONCLUDE_SUPERVISION,
    CREATE_SUPERVISION,
    GET_INSPECTION_DETAIL, GET_INSPECTION_DRAFT,
    GET_INSPECTIONS, MODIFY_SUPERVISION, SAVE_SUPERVISION_DRAFT
} from "../Queries/inspectionQueries";
import {ToBeInspectedReference} from "../../types/area.types";
import {SpoilageAgent} from "../../types/spoilageAgent.types";
import {FileWrapper} from "../../util/inspectionAdapter/FileWrapper";
import {OperatorFormAdapter} from "../../util/inspectionAdapter/OperatorFormAdapter";
import {OperatorForm} from "../../util/inspectionAdapter/OperatorForm";


/**
 * Function that adds a new inspection.
 */
const planInspection = async (apolloClient:ApolloClient<any>, inspectionData:PlanModifyInspection, navigate:Function):Promise<void> => {
    validatePlanInspection(inspectionData)
    const {data} = await apolloClient.mutate({
        mutation: CREATE_SUPERVISION,
        variables: {
            input: {
                ...inspectionData,
                elementId: inspectionData.elementId === '-1'? null: inspectionData.elementId,
                startDate: inspectionData.startDate?.toISOString().split('T')[0],
                endDate: inspectionData.endDate?.toISOString().split('T')[0],
            }
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.createSupervision.response){
        throw new Error(data.createSupervision.message)
    }
    navigate('/inspections/' + data.createSupervision.id)
};

/**
 * Function that modifies an inspection.
 */
const modifyInspection = async (apolloClient:ApolloClient<any>, inspectionData:PlanModifyInspection, fileList:Array<File>, adminId: string|undefined, navigate:Function):Promise<void> => {
    validateModifyInspection(inspectionData)
    const {data} = await apolloClient.mutate({
        mutation: MODIFY_SUPERVISION,
        variables: {
            input: {
                inspectionId: inspectionData.id,
                startDate: inspectionData.startDate?.toISOString().split('T')[0],
                endDate: inspectionData.endDate?.toISOString().split('T')[0],
                documentListing: fileList.length === 0? []: fileList[0],
                action: inspectionData.suggestedAction,
                adminId,
                responsibleId: inspectionData.responsibleId
            }
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if (data.updateSupervision.response){
        throw new Error(data.updateSupervision.message);
    }
    navigate('/inspections/' + inspectionData.id)
};

/**
 * Function that closes an inspection.
 */
const operativeCloseInspection = async (apolloClient:ApolloClient<any>, inspectionData: OperativeCloseInspection, createdDamages : Array<Damage>, updatedDamages : Array<Damage>, deletedDamages : Array<Damage>, toBeInspected: ToBeInspectedReference | undefined, spoilageAgents: Array<SpoilageAgent>, navigate:Function):Promise<void> => {
    validateOperativeCloseInspection(inspectionData);

    let res = await apolloClient.mutate({
        mutation: SAVE_SUPERVISION_DRAFT,
        variables: {
            input: {
                id: inspectionData.id,
                suggestedAction: inspectionData.suggestedAction,
                createdDamages: createdDamages.map((damage: Damage) => {
                    return{
                        ...damage,
                        __typename: undefined,
                        serverId: undefined,
                        id: damage.serverId,
                    }
                }),
                updatedDamages: updatedDamages.map((damage: Damage) => {
                    return{
                        ...damage,
                        __typename: undefined,
                        serverId: undefined,
                        id: damage.serverId,
                        // @ts-ignore
                        image: damage.image.length == 0 ? [] : ( (damage.image[0].hasOwnProperty('source'))? [] : damage.image)
                    }
                }),
                deletedDamages: deletedDamages.map((damage: Damage) => {
                    return damage.serverId
                }),
            },
        }
    });
    if(!res.data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(res.data.saveSupervisionDraft.response){
        throw new Error(res.data.saveSupervisionDraft.message)
    }

    res = await apolloClient.query({
        query: GET_INSPECTION_DRAFT,
        variables: {
            id: inspectionData.id
        },
        fetchPolicy: "no-cache",
    });
    if(!res.data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(res.data.retrieveSupervisionDraft.response){
        throw new Error(res.data.retrieveSupervisionDraft.message)
    }
    let dataCloseInspectionDraft: OperativeCloseInspection = res.data.retrieveSupervisionDraft;

    let file: FileWrapper | OperatorFormAdapter = new OperatorFormAdapter(new OperatorForm({
        data: dataCloseInspectionDraft,
        toBeInspected,
        spoilageAgents
    }))

<<<<<<< HEAD
    // @ts-ignore
    await (file as OperatorFormAdapter).produceFile()

    // const {data} = await apolloClient.mutate({
    //     mutation: CONCLUDE_SUPERVISION,
    //     variables: {
    //         input: {
    //             // @ts-ignore
    //             documentListing: [ await (file as OperatorFormAdapter).produceFile()],
    //             inspectionId: inspectionData.id,
    //             action: inspectionData.suggestedAction,
    //             adminId: null
    //         },
    //     }
    // });
    // if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    // if(data.concludeSupervision.response){
    //     throw new Error(data.concludeSupervision.message)
    // }
    // navigate('/inspections/' + inspectionData.id)
=======

    const doc : any = (file as OperatorFormAdapter).produceFile();

    await doc.then((doc:any) => doc.getBlob(async (blob:Blob) => {
        const {data} = await apolloClient.mutate({
            mutation: CONCLUDE_SUPERVISION,
            variables: {
                input: {
                    // @ts-ignore
                    documentListing: [new File([blob], "reporte_inspeccion_" + inspectionData.id + ".pdf")],
                    inspectionId: inspectionData.id,
                    action: inspectionData.suggestedAction,
                    adminId: null
                },
            }
        });
        if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
        if(data.concludeSupervision.response){
            throw new Error(data.concludeSupervision.message)
        }
    }))
    navigate('/inspections/' + inspectionData.id)
    navigate(0);
>>>>>>> 2be61a9f905798ee6189fc98061df714aaa9c223
};

/**
 * Function that save draft on an inspection closing.
 */
const operativeSaveInspectionDraft = async (apolloClient:ApolloClient<any>, inspectionData: OperativeCloseInspection, createdDamages : Array<Damage>, updatedDamages : Array<Damage>, deletedDamages : Array<Damage>, navigate:Function):Promise<void> => {
    validateOperativeCloseInspection(inspectionData);

    const {data} = await apolloClient.mutate({
        mutation: SAVE_SUPERVISION_DRAFT,
        variables: {
            input: {
                id: inspectionData.id,
                suggestedAction: inspectionData.suggestedAction,
                createdDamages: createdDamages.map((damage: Damage) => {
                    return{
                        ...damage,
                        __typename: undefined,
                        serverId: undefined,
                        id: damage.serverId,
                    }
                }),
                updatedDamages: updatedDamages.map((damage: Damage) => {
                    return{
                        ...damage,
                        __typename: undefined,
                        serverId: undefined,
                        id: damage.serverId,
                        // @ts-ignore
                        image: damage.image.length == 0 ? [] : ( (damage.image[0].hasOwnProperty('source'))? [] : damage.image)
                    }
                }),
                deletedDamages: deletedDamages.map((damage: Damage) => {
                    return damage.serverId
                }),
            },
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.saveSupervisionDraft.response){
        throw new Error(data.saveSupervisionDraft.message)
    }

    navigate('/inspections/' + inspectionData.id)
};


/**
 * Function that closes an inspection.
 */
const adminCloseInspection = async (apolloClient:ApolloClient<any>, inspectionData: AdminCloseInspection, adminId: string|undefined, navigate:Function):Promise<void> => {
    validateAdminCloseInspection(inspectionData);

    let file: FileWrapper = new FileWrapper(inspectionData.documentsListing);

    const {data} = await apolloClient.mutate({
        mutation: CONCLUDE_SUPERVISION,
        variables: {
            input: {
                documentListing: file.produceFile(),
                inspectionId: inspectionData.id,
                action: inspectionData.suggestedAction,
                adminId
            },
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.concludeSupervision.response){
        throw new Error(data.concludeSupervision.message)
    }
    navigate('/inspections/' + inspectionData.id)
    navigate(0);
};


/**
 * Function that retrieves an inspection draft in case it exists.
 */
const getCloseInspectionDraft = async (apolloClient:ApolloClient<any>, inspectionId: string, setState: Function, showSnackbar:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_INSPECTION_DRAFT,
        variables: {
            id: inspectionId
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.retrieveSupervisionDraft.response){
        throw new Error(data.retrieveSupervisionDraft.message)
    }
    let dataCloseInspectionDraft: OperativeCloseInspection = data.retrieveSupervisionDraft

    if(dataCloseInspectionDraft.hasDraftBeenFound){
        const extendedDamages = dataCloseInspectionDraft.damageListing.map((damage:Damage, index:number) => ({
            ...damage,
            id: index.toString(),
            serverId: damage.id,
            hasBeenCreated: false,
            hasBeenUpdated: false,
            hasBeenDeleted: false,
            hasImageBeenRemoved:false,
        }))

        setState({
            ...dataCloseInspectionDraft,
            damageListing: extendedDamages,
        })
        showSnackbar('Borrador cargado con éxito', 'success')
    }
}

/**
 * Function that retrieves an inspection draft in case it exists to administration review.
 */
const peekCloseInspectionDraft = async (apolloClient:ApolloClient<any>, inspectionId: string, setState: Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_INSPECTION_DRAFT,
        variables: {
            id: inspectionId
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.retrieveSupervisionDraft.response){
        throw new Error(data.retrieveSupervisionDraft.message)
    }


    setState(data.retrieveSupervisionDraft)
}

/**
 * Function that retrieves inspection listing with filters.
 */
const getInspectionsListing = async (apolloClient:ApolloClient<any>, setState:Function, filters:InspectionFilters):Promise<void> => {
    validateInspectionFilters(filters);
    const {data} = await apolloClient.query({
        query: GET_INSPECTIONS,
        variables: {
            input: {
                startDate: filters.startDate? filters.startDate.toISOString().split('T')[0] : null,
                endDate: filters.endDate? filters.endDate.toISOString().split('T')[0]: null,
                inspectionId: filters.inspectionId === "" ? null: filters.inspectionId,
                responsibleId: filters.responsibleId === "" ? null: filters.responsibleId,
                status: filters.status === "" ? null: filters.status
            }
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState(data.getFilteredSupervisions.map((supervision: any) => {
        return {
            ...supervision,
            startDate: new Date(supervision.startDate+ 'T06:00:00.000Z'),
            endDate: new Date(supervision.endDate+ 'T06:00:00.000Z')
        }
    }))
}

/**
 * Function that retrieves an inspection detail.
 */
const getInspectionDetail = async (apolloClient:ApolloClient<any>, setState:Function, inspectionId:string):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_INSPECTION_DETAIL,
        variables: {
            inspectionId
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState({
        ...data.getSupervision,
        startDate: new Date(data.getSupervision.startDate+ 'T06:00:00.000Z'),
        endDate: new Date(data.getSupervision.endDate+ 'T06:00:00.000Z'),
        closeDate: data.getSupervision.executionDate? new Date(data.getSupervision.executionDate + 'T06:00:00.000Z') : null,
        updateLog: data.getSupervision.updateLog.map((v: any) => {
            return {
                ...v,
                date: new Date(v.date+ 'T06:00:00.000Z')
            }
        })

    })
}

export {
    planInspection,
    modifyInspection,
    adminCloseInspection,
    operativeCloseInspection,
    getInspectionsListing,
    getInspectionDetail,
    operativeSaveInspectionDraft,
    getCloseInspectionDraft,
    peekCloseInspectionDraft,
}
