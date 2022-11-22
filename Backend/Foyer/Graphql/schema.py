from .nodes import *
from ..Controllers import MainController
from ..Models.DAO import SupervisionDAO
from ..Util import EmailServices

main_controller = MainController()
dao_sp = SupervisionDAO()


class Query(ObjectType):
    ########################
    # AREA RELATED QUERIES #
    ########################

    get_stories = List(Story)
    get_areas_listing = List(AreaListingNode)
    get_area_detail = Field(
        type_=AreaNode,
        required=True,
        args={
            'areaId': ID()
        },
        description='QUERY THAT FETCHES THE DETAIL OF THE AREA ASSOCIATED WITH THE GIVEN ID'

    )

    get_elements_listing = List(
        of_type=ElementListingNode,
        required=True,
        args={
            'areaId': ID()
        }
    )

    get_element_detail = Field(
        type_=ElementNode,
        required=True,
        args={
            'elementId': ID()
        }
    )

    get_full_areas = List(
        of_type=AreaReportNode
    )

    get_full_area = Field(
        type_=AreaReportNode,
        args={
            'areaId': ID()
        }
    )

    send_mail = ID()

    ##################################
    # SPOILAGE AGENT RELATED QUERIES #
    ##################################

    get_spoilage_agents = List(SpoilageAgentNode)

    ###############################
    # SUPERVISION RELATED QUERIES #
    ###############################

    get_filtered_supervisions = List(
        of_type=SupervisionNode,
        required=True,
        args={
            'input': FilteredSupervisionInput()
        },
        description='QUERY THAT FETCHES ALL THE SUPERVISIONS FILTERED'

    )
    get_supervision = Field(
        type_=SupervisionCompleteNode,
        required=True,
        args={
            'supervisionId': ID()
        }
    )

    get_supervisions_from_responsible = List(
        of_type=SupervisionNode,
        required=True,
        args={
            'responsibleId': ID()
        }
    )

    retrieve_supervision_draft = Field(
        type_=SupervisionDraftNode,
        required=True,
        args= {
            'id': ID()
        }
    )

    ######################################
    # EMPLOYEE & COMPANY & USER QUERIES  #
    ######################################

    retrieve_users = List(UserListingNode, user_type=Argument(String, required=False, default_value=None))
    retrieve_companies = List(CompanyNode)
    retrieve_employees = Field(
        List(EmployeeListingNode),
        type=Argument(String, required=False, default_value=None),
        company_name=Argument(String, required=False, default_value=None),
        roles=Argument(List(String), required=False, default_value=[])
    )
    #######################
    # STATISTICS QUERIES  #
    #######################

    get_supervisions_statistics = List(SupervisionStatisticsListingNode)
    get_supervisions_statistics_from_responsible = Field(
        type_=SupervisionStatisticsFromResponsibleNode,
        required=True,
        args={
            'responsibleId': ID()
        }
    )

    ##############################################
    # EMPLOYEE & COMPANY & USER QUERY RESOLVERS  #
    ##############################################

    def resolve_retrieve_users(self, info, **kwargs):
        '''
        Method that resolves the retrieve_users query
        '''
        return main_controller.retrieve_users(kwargs['user_type'])

    def resolve_retrieve_companies(self, info):
        '''
        Method that resolves the retrieve_companies query
        '''
        return main_controller.retrieve_companies()

    def resolve_retrieve_employees(self, info, **kawrgs):
        '''
        Method that resolves the retrieve_employees query
        '''
        return main_controller.retrieve_employees(kawrgs['type'], kawrgs['company_name'], kawrgs['roles'])

    ################################
    # AREA RELATED QUERY RESOLVERS #
    ################################

    def resolve_get_stories(self, _):
        return main_controller.get_stories()

    def resolve_get_areas_listing(self, _):
        return main_controller.get_areas()

    def resolve_get_area_detail(self, _, **kwargs):
        print(kwargs)
        return main_controller.get_area(kwargs['areaId'])

    def resolve_get_elements_listing(self, _, **kwargs):
        return main_controller.get_elements(kwargs['areaId'])

    def resolve_get_element_detail(self, _, **kwargs):
        return main_controller.get_element(kwargs['elementId'])

    def resolve_get_full_areas(self, _):
        return main_controller.get_areas_for_report()

    def resolve_get_full_area(self, _, **kwargs):
        return main_controller.get_full_area(kwargs['areaId'])

    def resolve_send_mail(self, _):
        EmailServices().email_created_user("", "PASSWORD", "administrador")
        return "1"

    ##########################################
    # SPOILAGE AGENT RELATED QUERY RESOLVERS #
    ##########################################

    def resolve_get_spoilage_agents(self, info):
        """
            Resolver that manages obtaining supervisions
            Args:
                info: not used

            Returns:
                List Of SpoilageAgentNode: returns all the spoilage agent in the system
        """
        return main_controller.get_spoilage_agents()

    #######################################
    # SUPERVISION RELATED QUERY RESOLVERS #
    #######################################

    def resolve_get_filtered_supervisions(self, info, **kwargs):
        """
            Resolver that manages obtaining supervisions
            Args:
                info: not used
                **kwargs: list of filters

            Returns:
                List Of SupervisionNode: returns all the supervisions in the system by the filter
        """
        return main_controller.get_filtered_supervisions(kwargs['input'])

    def resolve_get_supervision(self, info, **kwargs):
        """
            Resolver that manages obtaining supervisions
            Args:
                info: not used
                **kwargs: id of the supervision

            Returns:
                SupervisionCompleteNode: returns the supervision in the system by the id selected
        """
        return main_controller.get_supervision(kwargs['supervisionId'])

    def resolve_retrieve_supervision_draft(self, info, **kwargs):
        return main_controller.retrieve_supervision_draft(kwargs['id'])
    ######################################
    # STATISTICS RELATED QUERY RESOLVERS #
    ######################################

    def resolve_get_supervisions_statistics(self, info):
        return main_controller.get_supervisions_statistics()

    def resolve_get_supervisions_statistics_from_responsible(self, info, **kwargs):
        return main_controller.get_supervisions_statistics_from_responsible(kwargs['responsibleId'])


class Mutation(ObjectType):
    ##########################
    # AREA RELATED MUTATIONS #
    ##########################

    new_area = Field(
        type_=AreaResponseNode,
        required=True,
        args={
            'input': NewAreaInput()
        }
    )

    delete_area = Field(
        type_=GenericResponseNode,
        required=True,
        args={
            'areaId': ID()
        }
    )

    modify_area = Field(
        type_=AreaResponseNode,
        required=True,
        args={
            'input': ModifyAreaInput()
        }
    )

    transfer_element = Field(
        type_=ElementResponseNode,
        required=True,
        args={
            'elementId': ID(),
            'destinationAreaId': ID()
        }
    )

    new_image_test = String(
        args={
            'file': Upload()
        }
    )

    ########################################
    # EMPLOYEE & COMPANY & USER MUTATIONS  #
    ########################################

    register_user = Field(
        GenericResponseNode,
        id_number=String(),
        name=String(),
        surname=String(),
        email=String(),
        type=String()
    )

    login = Field(
        LoginResponseNode,
        email=String(),
        password=String()
    )

    first_login = Field(
        GenericResponseNode,
        email=String(),
        new_password=String(),
        password_confirmation=String()
    )

    recovery_code = Field(
        GenericResponseNode,
        email=String()
    )

    password_recovery = Field(
        GenericResponseNode,
        email=String(),
        new_password=String(),
        password_confirmation=String(),
        recovery_code=String()
    )

    add_company = Field(
        GenericResponseNode,
        id=String(),
        name=String(),
        email=String()
    )

    add_employee = Field(
        GenericResponseNode,
        employee_id=String(),
        company_id=String(),
        roles=List(String)
    )

    update_employee = Field(
        GenericResponseNode,
        employee_id=String(),
        company_id=String(),
        is_inspector=Boolean(),
        is_curator=Boolean(),
        is_restorer=Boolean()
    )

    update_company = Field(
        GenericResponseNode,
        company_id=String(),
        email=String()
    )

    delete_company = Field(
        GenericResponseNode,
        company_id=String()
    )

    delete_employee = Field(
        GenericResponseNode,
        employee_id=String()
    )

    ####################################
    # SPOILAGE AGENT RELATED MUTATIONS #
    ####################################

    create_spoilage_agent = ID(
        required=True,
        args={
            'input': NewSpoilageAgentInput()
        }
    )
    update_spoilage_agent = ID(
        required=True,
        args={
            'input': UpdateSpoilageAgentInput()
        }
    )

    delete_spoilage_agent = Boolean(
        required=True,
        args={
            'spoilageAgentId': ID()
        }
    )

    cud_spoilage_agent = Field(
        SpoilageAgentResponseNode,
        required=True,
        args={
            'input': CUDSpoilageAgentInput()
        }
    )

    #################################
    # SUPERVISION RELATED MUTATIONS #
    #################################

    create_supervision = Field(
        SupervisionResponseNode,
        required=True,
        args={
            'input': NewSupervisionInput()
        }
    )

    conclude_supervision = Field(
        SupervisionResponseNode,
        required=True,
        args={
            'input': ConcludeSupervisionInput()
        }
    )

    update_supervision = Field(
        SupervisionResponseNode,
        required=True,
        args={
            'input': UpdateSupervisionInput()
        }
    )

    save_supervision_draft = Field(
        GenericResponseNode,
        required=True,
        args={
            'input': SupervisionDraftInput()
        }
    )

    ###################################
    # AREA RELATED MUTATION RESOLVERS #
    ###################################

    def resolve_new_area(self, _, **kwargs):
        return main_controller.new_area(kwargs['input'])

    def resolve_delete_area(self, _, **kwargs) -> object:
        """
        Resolver that manages the deletion of an Area
        Args:
            _: info not used
            **kwargs: resolver arguments

        Returns:
            bool: returns if the record existed and was deleted
        """
        return main_controller.delete_area(kwargs['areaId'])

    def resolve_transfer_element(self, _, **kwargs):
        return main_controller.transfer_element(kwargs['elementId'], kwargs['destinationAreaId'])

    def resolve_modify_area(self, _, **kwargs):
        print('here')
        return main_controller.modify_area(kwargs['input'])

    def resolve_new_image_test(self, _, **kwargs):
        print(kwargs['file'].name)

    #############################################
    # SPOILAGE AGENT RELATED MUTATION RESOLVERS #
    #############################################

    def resolve_create_spoilage_agent(self, info, **kwargs):
        return main_controller.create_spoilage_agent(kwargs['input'])

    def resolve_update_spoilage_agent(self, info, **kwargs):
        return main_controller.update_spoilage_agent(kwargs['input'])

    def resolve_delete_spoilage_agent(self, info, **kwargs) -> bool:
        return main_controller.delete_spoilage_agent(kwargs['spoilageAgentId'])

    def resolve_cud_spoilage_agent(self, info, **kwargs):
        """
            Resolver that manages the CUD of a spoilage agent
            Args:
                info: not used
                **kwargs: resolver arguments

            Returns:
                GenericResponseNode: returns with the status of the different actions
        """
        return main_controller.cud_spoilage_agent(kwargs['input'])

    ##########################################
    # SUPERVISION RELATED MUTATION RESOLVERS #
    ##########################################

    def resolve_create_supervision(self, info, **kwargs):
        """
            Resolver that manages the creation of a supervision
            Args:
                info: not used
                **kwargs: resolver arguments

            Returns:
                GenericResponseNode: returns with the status of the creation
        """
        return main_controller.create_supervision(kwargs['input'])

    def resolve_conclude_supervision(self, info, **kwargs):
        """
            Resolver that manages the conclusion of a supervision
            Args:
                info: not used
                **kwargs: resolver arguments

            Returns:
                GenericResponseNode: returns with the status of the conclusion
        """
        return main_controller.conclude_supervision(kwargs['input'])

    def resolve_update_supervision(self, info, **kwargs):
        """
            Resolver that manages the update of a supervision
            Args:
                info: not used
                **kwargs: resolver arguments

            Returns:
                GenericResponseNode: returns with the status of the update
        """
        return main_controller.update_supervision(kwargs['input'])

    def resolve_save_supervision_draft(self, info, **kwargs):
        return main_controller.update_supervision_draft(kwargs['input'])

    #################################################
    # EMPLOYEE & COMPANY & USER MUTATION RESOLVERS  #
    #################################################

    def resolve_register_user(self, info, id_number, name, surname, email, type):
        '''
        Mutation resolver for registering a new user
        '''
        return main_controller.register_user(id_number, name, surname, email, type)

    def resolve_login(self, info, email, password):
        '''
        Mutation resolver for logging in a user
        '''
        return main_controller.login(email, password)

    def resolve_first_login(self, info, email, new_password, password_confirmation):
        '''
        Mutation resolver for the first login of a user
        '''
        return main_controller.first_login(email, new_password, password_confirmation)

    def resolve_recovery_code(self, info, email):
        '''
        Mutation resolver for requesting a recovery code
        '''
        return main_controller.recovery_code(email)

    def resolve_password_recovery(self, info, email, new_password, password_confirmation, recovery_code):
        '''
        Mutation resolver for recovering a password
        '''
        return main_controller.password_recovery(email, new_password, password_confirmation, recovery_code)

    def resolve_add_company(self, info, id, name, email):
        '''
        Mutation resolver for adding a company
        '''
        return main_controller.add_company(id, name, email)

    def resolve_add_employee(self, info, employee_id, company_id, roles):
        '''
        Mutation resolver for adding an employee
        '''
        return main_controller.add_employee(employee_id, company_id, roles)

    def resolve_update_employee(self, info, employee_id, company_id, is_inspector, is_curator, is_restorer):
        '''
        Mutation resolver for updating an employee
        '''
        print('here')
        return main_controller.update_employee(employee_id, company_id, is_inspector, is_curator, is_restorer)

    def resolve_update_company(self, info, company_id, email):
        '''
        Mutation resolver for updating a company
        '''
        return main_controller.update_company(company_id, email)

    def resolve_delete_company(self, info, company_id):
        '''
        Mutation resolver for deleting a company
        '''
        return main_controller.delete_company(company_id)

    def resolve_delete_employee(self, info, employee_id):
        '''
        Mutation resolver for deleting an employee
        '''
        return main_controller.delete_employee(employee_id)


schema: Schema = Schema(query=Query, mutation=Mutation)
