import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Stack, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import {AddModifyArea, AddModifyElement, Story} from "../../../types/area.types";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {useLocation, useNavigate} from "react-router-dom";
import {DownloadableFile, UploadableFile} from "../../../types/common.types";
import AreaForm from "./components/AreaForm";
import ElementForm from "./components/ElementForm";
import EmptyListing from "../../../components/EmptyListing";
import {Add} from "@mui/icons-material";
import {getAreasForModify, modifyArea} from "../../../graphQL/Functions/area";

interface OwnProps {}

type Props = OwnProps;

const ModifyArea: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)
    const navigate = useNavigate();
    const location = useLocation();

    const permittedFileFormat = ['image/png', 'image/jpg', 'image/jpeg']

    const [modifiedArea, setModifiedArea] = useState<AddModifyArea>({
        id:'',
        name:'',
        story:'FIRST',
        location:'',
        description: '',
        elementListing: [
            {
                id:0,
                hasBeenCreated: false,
                hasBeenUpdated: false,
                hasBeenDeleted: false,
                name: '',
                location: '',
                description: '',
                imagesListing: [],
                createdImages:[],
                deletedImages:[],
            }
        ],
        createdElements:[],
        updatedElements:[],
        deletedElements:[],
        createdImages:[],
        deletedImages:[],
        imagesListing:[]
    });

    const [onChangeElementId, setOnChangeElementId] = useState<number>(0);

    const handleAreaNameChange = (onChangeAreaName:string) : void => {
        setModifiedArea({
            ...modifiedArea,
            name:onChangeAreaName,
        })
    }

    const handleAreaStoryChange = (onChangeStory:Story) : void => {
        setModifiedArea({
            ...modifiedArea,
            story:onChangeStory,
        })
    }

    const handleAreaLocationChange = (onChangeLocation:string) : void => {
        setModifiedArea({
            ...modifiedArea,
            location:onChangeLocation,
        })
    }

    const handleAreaDescriptionChange = (onChangeDescription:string) : void => {
        setModifiedArea({
            ...modifiedArea,
            description:onChangeDescription,
        })
    }

    const handleAddAreaImage = (onChangeImage: File | null): void => {
        if(permittedFileFormat.includes(onChangeImage?.type as string)){
            const newImagesListing:Array<File | UploadableFile | DownloadableFile | null> = modifiedArea.imagesListing;
            const newCreatedImages:Array<File | null> | undefined = modifiedArea.createdImages;
            newImagesListing.push(onChangeImage)
            newCreatedImages?.push(onChangeImage)
            setModifiedArea({
                ...modifiedArea,
                imagesListing: newImagesListing as Array<File>,
                createdImages: newCreatedImages,
            })
        }else{
            showSnackbar('Por favor adjunte un archivo de formato de imagen',  'warning')
        }
    }

    const handleRemoveAreaImage = (onChangeImage: File | UploadableFile | DownloadableFile | null): void => {
        const newImagesListing:Array<File | UploadableFile | DownloadableFile | null> = modifiedArea.imagesListing.filter((image ) => (image as File)?.lastModified !== (onChangeImage as File)?.lastModified)

        if(modifiedArea.createdImages?.includes((onChangeImage as File))){
            const newCreatedImages:Array<File | null> = modifiedArea.createdImages.filter((image ) => image?.lastModified !== (onChangeImage as File)?.lastModified)
            setModifiedArea({
                ...modifiedArea,
                imagesListing: newImagesListing as Array<File>,
                createdImages: newCreatedImages
            })
        }else{
            let newDeletedImages:Array<string | undefined> = []
            modifiedArea.imagesListing.forEach(image => {
                if((image as DownloadableFile)?.id === (onChangeImage as DownloadableFile)?.id){
                    newDeletedImages.push((image as DownloadableFile)?.id)
                }
            })
            setModifiedArea({
                ...modifiedArea,
                imagesListing: newImagesListing as Array<File>,
                deletedImages: newDeletedImages as Array<string>
            })
        }
    }

    const handleAreaAddElementChange = (): void => {
        const newElementListing:Array<AddModifyElement> = modifiedArea.elementListing;
        const newCreatedElements:Array<AddModifyElement> | undefined = modifiedArea.createdElements
        let lastElementId: number | undefined = modifiedArea.elementListing[modifiedArea.elementListing.length - 1]?.id
        const newElementId:number = modifiedArea.elementListing.length ? (lastElementId as number) + 1 : 0

        const newElement = {
            id: newElementId,
            name: '',
            location: '',
            description: '',
            imagesListing: [],
            hasBeenCreated:true,
        }

        newElementListing.push(newElement)
        newCreatedElements?.push(newElement)

        setModifiedArea({
            ...modifiedArea,
            elementListing: newElementListing,
            createdElements: newCreatedElements as Array<AddModifyElement>
        })
    }

    const handleAreaRemoveElementChange = (onChangeElementId:number): void => {
        const newElementListing:Array<AddModifyElement> = modifiedArea.elementListing.filter((element ) => element.id !== onChangeElementId)
        let hasBeenFound = false
        modifiedArea.createdElements?.forEach(element => {
            if(element.id === onChangeElementId){
                hasBeenFound = true
                const newCreatedElements:Array<AddModifyElement | undefined> = (modifiedArea.createdElements as Array<AddModifyElement>).filter((element:AddModifyElement) => element.id !== onChangeElementId)
                setModifiedArea({
                    ...modifiedArea,
                    elementListing: newElementListing as Array<AddModifyElement>,
                    createdElements: newCreatedElements as Array<AddModifyElement>
                })
            }
        })

        if(!hasBeenFound){
            let newDeletedElements:Array<string> | undefined = modifiedArea.deletedElements;
            modifiedArea.elementListing.forEach(element => {
                if(element.id === onChangeElementId){
                    (newDeletedElements as Array<string>).push(element.serverId as string)
                }
            })
            setModifiedArea({
                ...modifiedArea,
                elementListing: newElementListing,
                deletedElements: newDeletedElements,
            })
        }
    }

    const handleElementNameChange = (onChangeElementName:string) : void => {

        modifiedArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                element.hasBeenUpdated=true;
                setModifiedArea({
                    ...modifiedArea,
                    elementListing: [
                        ...modifiedArea.elementListing.slice(0,index),
                        {
                            ...modifiedArea.elementListing[index],
                            name:onChangeElementName,
                        },
                        ...modifiedArea.elementListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleElementLocationChange = (onChangeElementLocation:string) : void => {
        modifiedArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                element.hasBeenUpdated=true;
                setModifiedArea({
                    ...modifiedArea,
                    elementListing: [
                        ...modifiedArea.elementListing.slice(0,index),
                        {
                            ...modifiedArea.elementListing[index],
                            location:onChangeElementLocation,
                        },
                        ...modifiedArea.elementListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleElementDescriptionChange = (onChangeElementDescription:string) : void => {
        modifiedArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                element.hasBeenUpdated=true;
                setModifiedArea({
                    ...modifiedArea,
                    elementListing: [
                        ...modifiedArea.elementListing.slice(0,index),
                        {
                            ...modifiedArea.elementListing[index],
                            description:onChangeElementDescription,
                        },
                        ...modifiedArea.elementListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleAddElementImage = (onChangeImage:File | null) : void => {
        if(permittedFileFormat.includes(onChangeImage?.type as string)){
            modifiedArea.elementListing.forEach((element:AddModifyElement, index:number) => {
                if(element.id === onChangeElementId){
                    element.hasBeenUpdated=true;
                    const newImagesListing:Array<File | UploadableFile | DownloadableFile | null> = element.imagesListing;
                    const newCreatedImages:Array<File | null> | undefined = element.createdImages;
                    newImagesListing.push(onChangeImage)
                    newCreatedImages?.push(onChangeImage)
                    setModifiedArea({
                        ...modifiedArea,
                        elementListing: [
                            ...modifiedArea.elementListing.slice(0,index),
                            {
                                ...modifiedArea.elementListing[index],
                                imagesListing:newImagesListing as Array<File>,
                                createdImages:newCreatedImages as Array<File>,
                            },
                            ...modifiedArea.elementListing.slice(index+1)
                        ]
                    })
                }
            })
        }else{
            showSnackbar('Por favor adjunte un archivo de formato de imagen',  'warning')
        }
    }

    const handleRemoveElementImage = (onChangeImage:File | UploadableFile | DownloadableFile | null): void => {
        modifiedArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                element.hasBeenUpdated=true;
                const newImagesListing:Array<File | UploadableFile | DownloadableFile | null> = modifiedArea.elementListing[index].imagesListing.filter((image ) => (image as File)?.lastModified !== (onChangeImage as File)?.lastModified)
                if(element.createdImages?.includes((onChangeImage as File))){
                    const newCreatedImages:Array<File | null> = element.createdImages.filter((image ) => image?.lastModified !== (onChangeImage as File)?.lastModified)
                    setModifiedArea({
                        ...modifiedArea,
                        elementListing: [
                            ...modifiedArea.elementListing.slice(0,index),
                            {
                                ...modifiedArea.elementListing[index],
                                imagesListing:newImagesListing as Array<File>,
                                createdImages:newCreatedImages as Array<File>,
                            },
                            ...modifiedArea.elementListing.slice(index+1)
                        ]
                    })
                }else{
                    let newDeletedImages:Array<string | undefined> = []
                    element.imagesListing.forEach(image => {
                        if((image as unknown as DownloadableFile)?.id === (onChangeImage as DownloadableFile)?.id){
                            newDeletedImages.push((image as unknown as DownloadableFile)?.id)
                        }
                    })
                    setModifiedArea({
                        ...modifiedArea,
                        elementListing: [
                            ...modifiedArea.elementListing.slice(0,index),
                            {
                                ...modifiedArea.elementListing[index],
                                imagesListing:newImagesListing as Array<File>,
                                deletedImages:newDeletedImages as Array<string>,
                            },
                            ...modifiedArea.elementListing.slice(index+1)
                        ]
                    })
                }
            }
        })
    }

    const handleModifyArea = async () => {
        try {
            const createdElements = modifiedArea.elementListing.filter(element => element.hasBeenCreated)
            const updatedElements = modifiedArea.elementListing.filter(element => element.hasBeenUpdated)
            await modifyArea(apolloClient, modifiedArea, createdElements, updatedElements, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    useEffect(() => {
        getAreasForModify(apolloClient, location.state.areaId, setModifiedArea)
    }, []);

    return (
        <Box>
            <GoBackButton/>
            <Box
                sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    marginBottom:8
                }}
            >
                <Typography variant='h4' fontWeight='bold'>MODIFICAR ÁREA</Typography>
                <Button
                    variant='contained'
                    onClick={handleModifyArea}
                    sx={{width:'30%', height:56}}
                >Modificar area</Button>
            </Box>
            <AreaForm
                newAreaData={modifiedArea}
                nameChangeHandler={handleAreaNameChange}
                storyChangeHandler={handleAreaStoryChange}
                locationChangeHandler={handleAreaLocationChange}
                descriptionChangeHandler={handleAreaDescriptionChange}
                addImageChangeHandler={handleAddAreaImage}
                removeImageChangeHandler={handleRemoveAreaImage}/>
            <Stack gap={4} sx={{marginY:4}}>
                <Typography variant='h5' fontWeight='bold'>Modificar elementos del área</Typography>
                {
                    modifiedArea.elementListing.length?
                        modifiedArea.elementListing.map((element) => {
                            return (
                                <ElementForm
                                    newElementData={element}
                                    nameChangeHandler={handleElementNameChange}
                                    locationChangeHandler={handleElementLocationChange}
                                    descriptionChangeHandler={handleElementDescriptionChange}
                                    addImageChangeHandler={handleAddElementImage}
                                    removeImageChangeHandler={handleRemoveElementImage}
                                    removeElementChangeHandler={handleAreaRemoveElementChange}
                                    transactionElementIdChangeHandler={setOnChangeElementId}
                                />
                            )
                        })
                        :
                        <EmptyListing emptyListingMessage={'Al parecer no hay elementos asociados a esta área. Utiliza el botón de abajo para agregar nuevos.'}/>
                }
                <Button
                    variant='outlined'
                    startIcon={<Add/>}
                    sx={{width:'30%', alignSelf:'center'}}
                    onClick={handleAreaAddElementChange}
                >Agregar elemento</Button>
            </Stack>
        </Box>
    );
};

export default ModifyArea;
