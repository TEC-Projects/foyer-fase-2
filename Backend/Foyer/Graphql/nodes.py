from graphene_file_upload.scalars import Upload
from graphene import *
from graphene_django import DjangoObjectType

from Foyer.Models import Role, User


######################
# AREA RELATED NODES #
######################

class ResponseInterface(Interface):
    response = Boolean()
    message = String()


class Story(ObjectType):
    id = ID()
    value = String()


class ImageNode(ObjectType):
    id = ID()
    name = String()
    source = String()


class TheatreGoodInterface(Interface):
    id = ID()
    name = String()
    description = String()
    location = String()
    images_listing = List(ImageNode)


class ElementListingNode(ObjectType):
    id = ID()
    name = String()
    location = String()


class ElementNode(ObjectType):
    class Meta:
        interfaces = (TheatreGoodInterface, ResponseInterface,)

    parent_area = String()


class AreaListingNode(ObjectType):
    id = ID()
    name = String()
    story = String()
    element_count = Int()


class AreaNode(ObjectType):
    class Meta:
        interfaces = (TheatreGoodInterface, ResponseInterface,)

    element_listing = List(ElementListingNode)
    story = String()


class AreaReportNode(ObjectType):
    class Meta:
        interfaces = (TheatreGoodInterface,)

    element_listing = List(ElementNode)
    story = String()


##############################
# AREA RELATED CUSTOM RETURN #
##############################

class AreaResponseNode(ObjectType):
    class Meta:
        interfaces = (ResponseInterface,)

    area_id = ID()


class ElementResponseNode(ObjectType):
    class Meta:
        interfaces = (ResponseInterface,)

    element_id = ID()


######################
# AREA RELATED INPUT #
######################

class NewElementInput(InputObjectType):
    name = String()
    location = String()
    description = String()
    # images_listing = List(String)
    images_listing = List(Upload)


class ModifyElementInput(InputObjectType):
    id = String()
    name = String()
    location = String()
    description = String()
    # created_images = List(String)
    created_images = List(Upload)
    deleted_images = List(ID)


class NewAreaInput(InputObjectType):
    name = String()
    story = ID()
    location = String()
    description = String()
    images_listing = List(Upload)
    # images_listing = List(String)
    element_listing = List(NewElementInput)


class ModifyAreaInput(InputObjectType):
    id = ID()
    name = String()
    story = ID()
    location = String()
    description = String()
    deleted_images = List(ID)
    # created_images = List(String)
    created_images = List(Upload)
    created_elements = List(NewElementInput)
    modified_elements = List(ModifyElementInput)
    deleted_elements = List(ID)


#####################################
# USERS AND EMPLOYEES RELATED NODES #
#####################################

class roleNode(DjangoObjectType):
    '''
    Class node that contains the role model for gaphql queries
    '''

    class Meta:
        model = Role
        fields = ["role_type_id", "value"]


class UserNode(DjangoObjectType):
    '''
    Class node that contains the user model for gaphql queries
    '''

    class Meta:
        model = User
        fields = ["id_number", "name", "surname", "email", "password", "new_user", "type"]


class UserListingNode(ObjectType):
    '''
    Class node that contains the user model for gaphql queries for listing purposes
    '''
    user_id = ID()
    id = ID()
    name = String()
    surname = String()
    email = String()
    type = String()


class LoginResponseNode(ObjectType):
    '''
    Class node that contains the model for gaphql queries for login response purposes
    '''
    token = String()
    user = Field(UserListingNode)
    new_user = Boolean()
    response = Boolean()
    message = String()


class GenericResponseNode(ObjectType):
    '''
    Class node that contains the response model for gaphql queries
    '''
    response = Boolean()
    message = String()


class EmployeeListingNode(ObjectType):
    '''
    Class node that contains the employee model for gaphql queries for listing purposes
    '''
    id = ID()
    user = Field(UserListingNode)
    company_name = String()
    role = List(String)
    type = String()


##########################
# SPOILAGE RELATED NODES #
##########################

class SpoilageAgentNode(ObjectType):
    """
    Class that contains the Spoilage Agent model for graphql queries
    """
    id = Int()
    name = String()
    type = String()


class SpoilageAgentResponseNode(ObjectType):
    """
    Class that contains the listing of response model for the CUD of Spoilage Agent
    """
    created_sa_response = List(GenericResponseNode)
    updated_sa_response = List(GenericResponseNode)
    deleted_sa_response = List(GenericResponseNode)


##########################
# SPOILAGE RELATED INPUT #
##########################

class NewSpoilageAgentInput(InputObjectType):
    """
    Class that contains the input model for the creation of spoilage agent
    """
    name = String()
    type = ID()


class UpdateSpoilageAgentInput(InputObjectType):
    """
    Class that contains the input model for the update of spoilage agent
    """
    id = ID()
    name = String()


class CUDSpoilageAgentInput(InputObjectType):
    """
    Class that contains the input model for the CUD of spoilage agent
    """
    createdSpoilageAgents = List(NewSpoilageAgentInput)
    updatedSpoilageAgents = List(UpdateSpoilageAgentInput)
    deletedSpoilageAgents = List(ID)


#############################
# SUPERVISION RELATED NODES #
#############################

class SupervisionResponseNode(ObjectType):
    """
    Class that contains the response model for supervision queries
    """
    response = Boolean()
    message = String()
    id = ID()


class ToBeInspectedNode(ObjectType):
    """
    Class that contains the model of the object to be inspected in the supervision
    """
    id = ID()
    name = String()
    type = String()


class Responsible(ObjectType):
    """
    Class that contains the model of the responsible in the supervision
    """
    id = String()
    name = String()


class SupervisionNode(ObjectType):
    """
    Class that contains the model of the supervision
    """
    id = ID()
    toBeInspected = Field(ToBeInspectedNode)
    responsible = Field(Responsible)
    status = String()
    startDate = String()
    executionDate = String()
    endDate = String()
    action = String()


class DocumentsListing(ObjectType):
    """
    Class that contains the model of the list the pdfs in the supervision
    """
    name = String()
    source = String()


class UpdateLog(ObjectType):
    """
    Class that contains the model of the log change in the supervision
    """
    authorName = String()
    date = String()
    description = String()


class SupervisionCompleteNode(ObjectType):
    """
    Class that contains the model of the supervision with the complete information
    """
    id = ID()
    toBeInspected = Field(ToBeInspectedNode)
    responsible = Field(Responsible)
    status = String()
    startDate = String()
    endDate = String()
    executionDate = String()
    action = String()
    documentsListing = List(DocumentsListing)
    updateLog = List(UpdateLog)


#############################
# SUPERVISION RELATED INPUT #
#############################

class FilteredSupervisionInput(InputObjectType):
    """
    Class that contains the input model with the different filters for the retrieve supervision
    """
    inspectionId = ID()
    responsibleId = ID()
    startDate = String()
    endDate = String()
    status = String()


class NewSupervisionInput(InputObjectType):
    """
    Class that contains the input model with the different fields for the creation of the supervision
    """
    areaId = String()
    elementId = String()
    responsibleId = String()
    startDate = String()
    endDate = String()


class ConcludeSupervisionInput(InputObjectType):
    """
    Class that contains the input model with the different fields for the conclusion of the supervision
    """
    inspectionId = ID()
    adminId = ID()
    action = String()
    documentListing = List(Upload)


class UpdateSupervisionInput(InputObjectType):
    """
    Class that contains the input model with the different fields for the updated of the supervision
    """
    inspectionId = ID()
    adminId = ID()
    responsibleId = String()
    startDate = String()
    endDate = String()
    action = String()
    documentListing = List(Upload)


class CompanyNode(ObjectType):
    id = ID()
    name = String()
    email = String()


class SupervisionDraftDamageRecordNode(ObjectType):
    id = ID()
    spoilage_agent_id = ID()
    observations = String()
    recommendations = String()
    image = List(
        of_type=ImageNode
    )

    class Meta:
        interfaces = (ResponseInterface,)


class SupervisionDraftNode(ObjectType):
    id = ID()
    suggested_action = String()
    has_draft_been_found = Boolean()
    damage_listing = List(
        of_type=SupervisionDraftDamageRecordNode
    )

    class Meta:
        interfaces = (ResponseInterface,)


class SupervisionDraftDamageRecordInput(InputObjectType):
    id = ID()
    spoilage_agent_id = ID()
    observations = String()
    recommendations = String()
    image = List(
        of_type=Upload
    )
    has_been_created = Boolean()
    has_been_deleted = Boolean()
    has_been_updated = Boolean()
    has_image_been_removed = Boolean()
    __typename = ID()
    
class SupervisionDraftInput(InputObjectType):
    id = ID()
    suggested_action = String()
    created_damages = List(
        of_type=SupervisionDraftDamageRecordInput
    )
    deleted_damages = List(
        of_type=ID
    )
    updated_damages = List(
        of_type=SupervisionDraftDamageRecordInput
    )



#############################
# STATISTICS RELATED NODES #
#############################

class SupervisionStatisticsListingNode(ObjectType):
    """
    Class that contains the model of the supervision statistics
    """
    status = String()
    absoluteCount = Int()


class SupervisionStatisticsFromResponsibleNode(ObjectType):
    """
    Class that contains the model of the supervision statistics
    """
    response = Boolean()
    message = String()
    dataset = List(SupervisionStatisticsListingNode)
    responsible = Field(EmployeeListingNode)
