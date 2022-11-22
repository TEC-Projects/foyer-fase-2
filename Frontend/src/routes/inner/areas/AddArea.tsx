import React, {FunctionComponent, useContext, useState} from 'react';
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import CustomTextField from "../../../components/fields/CustomTextField";
import {AddModifyArea, AddModifyElement, ElementListingItem, Story} from "../../../types/area.types";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {useNavigate} from "react-router-dom";
import {DownloadableFile, UploadableFile} from "../../../types/common.types";
import AreaForm from "./components/AreaForm";
import ElementForm from "./components/ElementForm";
import EmptyListing from "../../../components/EmptyListing";
import {Add} from "@mui/icons-material";
import {addArea} from "../../../graphQL/Functions/area";

interface OwnProps {}

type Props = OwnProps;

const AddArea: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)
    const navigate = useNavigate();

    const permittedFileFormat = ['image/png', 'image/jpg', 'image/jpeg']

    const [newArea, setNewArea] = useState<AddModifyArea>({
        name:'',
        story:'FIRST',
        location:'',
        description: '',
        elementListing: [
            {
                id:0,
                name: '',
                location: '',
                description: '',
                imagesListing: []
            }
        ],
        imagesListing: []
    });

    const [onChangeElementId, setOnChangeElementId] = useState<number>(0);

    const handleAreaNameChange = (onChangeAreaName:string) : void => {
        setNewArea({
            ...newArea,
            name:onChangeAreaName,
        })
    }

    const handleAreaStoryChange = (onChangeStory:Story) : void => {
        setNewArea({
            ...newArea,
            story:onChangeStory,
        })
    }

    const handleAreaLocationChange = (onChangeLocation:string) : void => {
        setNewArea({
            ...newArea,
            location:onChangeLocation,
        })
    }

    const handleAreaDescriptionChange = (onChangeDescription:string) : void => {
        setNewArea({
            ...newArea,

            description:onChangeDescription,
        })
    }

    const handleAddAreaImage = (onChangeImage: File | null): void => {
        if(permittedFileFormat.includes(onChangeImage?.type as string)){
            const newImagesListing:Array<File | UploadableFile | DownloadableFile | null> = newArea.imagesListing;
            newImagesListing.push(onChangeImage)
            setNewArea({
                ...newArea,
                imagesListing: newImagesListing as Array<File>
            })
        }else{
            showSnackbar('Por favor adjunte un archivo de formato de imagen',  'warning')
        }
    }

    const handleRemoveAreaImage = (onChangeImage: File | UploadableFile | DownloadableFile | null): void => {
        const newImagesListing:Array<File | UploadableFile | DownloadableFile | null> = newArea.imagesListing.filter((image ) => (image as File)?.lastModified !== (onChangeImage as File)?.lastModified)
        setNewArea({
            ...newArea,
            imagesListing: newImagesListing as Array<File>
        })
    }

    const handleAreaAddElementChange = (): void => {
        const newElementListing:Array<AddModifyElement> = newArea.elementListing;
        let lastElementId: number | undefined = newArea.elementListing[newArea.elementListing.length - 1]?.id
        const newElementId:number = newArea.elementListing.length ? (lastElementId as number) + 1 : 0
        newElementListing.push({
            id: newElementId,
            name: '',
            location: '',
            description: '',
            imagesListing: []
        })
        setNewArea({
            ...newArea,
            elementListing: newElementListing
        })
    }

    const handleAreaRemoveElementChange = (onChangeElementId:number): void => {
        console.log(onChangeElementId)
        const newElementListing:Array<AddModifyElement> = newArea.elementListing.filter((element ) => element.id !== onChangeElementId)
        setNewArea({
            ...newArea,
            elementListing: newElementListing
        })
    }

    const handleElementNameChange = (onChangeElementName:string) : void => {
        newArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                setNewArea({
                    ...newArea,
                    elementListing: [
                        ...newArea.elementListing.slice(0,index),
                        {
                            ...newArea.elementListing[index],
                            name:onChangeElementName,
                        },
                        ...newArea.elementListing.slice(index+1)
                    ]
            })
            }
        })
    }

    const handleElementLocationChange = (onChangeElementLocation:string) : void => {
        newArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                setNewArea({
                    ...newArea,
                    elementListing: [
                        ...newArea.elementListing.slice(0,index),
                        {
                            ...newArea.elementListing[index],
                            location:onChangeElementLocation,
                        },
                        ...newArea.elementListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleElementDescriptionChange = (onChangeElementDescription:string) : void => {
        newArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                setNewArea({
                    ...newArea,
                    elementListing: [
                        ...newArea.elementListing.slice(0,index),
                        {
                            ...newArea.elementListing[index],
                            description:onChangeElementDescription,
                        },
                        ...newArea.elementListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleAddElementImage = (onChangeImage:File | null) : void => {
        if(permittedFileFormat.includes(onChangeImage?.type as string)){
            newArea.elementListing.forEach((element:AddModifyElement, index:number) => {
                if(element.id === onChangeElementId){
                    let newImagesListing:Array<File | UploadableFile | null> = element.imagesListing;
                    newImagesListing.push(onChangeImage)
                    setNewArea({
                        ...newArea,
                        elementListing: [
                            ...newArea.elementListing.slice(0,index),
                            {
                                ...newArea.elementListing[index],
                                imagesListing:newImagesListing as Array<File>
                            },
                            ...newArea.elementListing.slice(index+1)
                        ]
                    })
                }
            })
        }else{
            showSnackbar('Por favor adjunte un archivo de formato de imagen',  'warning')
        }
    }

    const handleRemoveElementImage = (onChangeImage:File | UploadableFile | DownloadableFile | null): void => {
        newArea.elementListing.forEach((element:AddModifyElement, index:number) => {
            if(element.id === onChangeElementId){
                const newImagesListing:Array<File | UploadableFile | null> = newArea.elementListing[index].imagesListing.filter((image ) => (image as File)?.lastModified !== (onChangeImage as File)?.lastModified)
                setNewArea({
                    ...newArea,
                    elementListing: [
                        ...newArea.elementListing.slice(0,index),
                        {
                            ...newArea.elementListing[index],
                            imagesListing:newImagesListing as Array<File>
                        },
                        ...newArea.elementListing.slice(index+1)
                    ]
                })
            }
        })
    }

    const handleAddArea = async () => {
        try {
            await addArea(apolloClient, newArea, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

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
                <Typography variant='h4' fontWeight='bold'>CREAR ÁREA</Typography>
                <Button
                    variant='contained'
                    onClick={handleAddArea}
                    sx={{width:'30%', height:56}}
                >Agregar area</Button>
            </Box>
            <AreaForm
                newAreaData={newArea}
                nameChangeHandler={handleAreaNameChange}
                storyChangeHandler={handleAreaStoryChange}
                locationChangeHandler={handleAreaLocationChange}
                descriptionChangeHandler={handleAreaDescriptionChange}
                addImageChangeHandler={handleAddAreaImage}
                removeImageChangeHandler={handleRemoveAreaImage}/>
            <Stack gap={4} sx={{marginY:4}}>
                <Typography variant='h5' fontWeight='bold'>Agregar elementos al área</Typography>
                {
                    newArea.elementListing.length?
                        newArea.elementListing.map((element) => {
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

export default AddArea;
