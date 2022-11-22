import {DownloadableFile, UploadableFile} from "./common.types";

type Story = 'FIRST' | 'SECOND' | 'THIRD' | 'BASEMENT' | 'OUTSIDE'
type ToBeInspected = 'AREA' | 'ELEMENT'

type AreaListingItem = {
    id:string,
    name:string,
    story: Story,
    elementCount:number
}

type ElementListingItem = {
    id: string,
    name: string,
    location?: string,
}

type Area = {
    id:string,
    name:string,
    story:Story,
    location:string,
    description: string,
    elementListing: Array<ElementListingItem>
    imagesListing: Array<DownloadableFile>
}

type Element = {
    id: string,
    name: string,
    parentArea: string,
    location: string,
    description: string,
    imagesListing: Array<DownloadableFile>
}

type AddModifyArea = {
    id?:string,
    name:string,
    story:Story,
    location:string,
    description: string,
    elementListing: Array<AddModifyElement>,
    createdElements?:Array<AddModifyElement>,
    updatedElements?:Array<AddModifyElement>,
    deletedElements?:Array<string>,
    createdImages?:Array<File | null>,
    deletedImages?:Array<string>
    imagesListing: Array<File | UploadableFile | DownloadableFile | null>
}


type AddModifyElement = {
    id?:number,
    serverId?:string,
    hasBeenCreated?: boolean,
    hasBeenUpdated?: boolean,
    hasBeenDeleted?: boolean,
    name: string,
    location: string,
    description: string,
    createdImages?:Array<File | null>,
    deletedImages?:Array<string>
    imagesListing: Array<File | UploadableFile>
}

type ToBeInspectedReference = {
    id: string,
    name: string
    type: ToBeInspected
}


export type {
    Story,
    AreaListingItem,
    ElementListingItem,
    Area,
    Element,
    ToBeInspectedReference,
    AddModifyArea,
    AddModifyElement,
    ToBeInspected,
}
