import re

from Foyer.Models.DAO.AreaDAO import AreaDAO, Area
from Foyer.Models.DAO.ElementDAO import ElementDAO
from Foyer.Models.DAO.ImageDAO import ImageDAO
from Foyer.Models.Area import Area
from Foyer.Models.Element import Element
from Foyer.Models.EStory import EStory

from Foyer.Util.GeneralUtil import check_event_loop, error


class AreaAdmin:
    """
    Class that models the controller of all that has to do with areas, elements and components.
    """
    dao_area: AreaDAO
    dao_element: ElementDAO
    dao_image: ImageDAO

    def __init__(self):
        super().__init__()
        self.dao_area = AreaDAO()
        self.dao_element = ElementDAO()
        self.dao_image = ImageDAO()

    def new_area(self, input: dict) -> object:
        """
        FUNCTION THAT CREATES A NEW AREA
        Args:
            input: AREA INPUT

        Returns:
            AREA ID OR ERROR IF ANY
        """

        if Area.objects.filter(info__name=input['name']).exists():
            return error('Un área con el mismo nombre ya ha sido registrada. Por favor elije un nombre nuevo')
        if len(set(map(lambda x: x['name'], input['element_listing']))) != len(input['element_listing']):
            return error('Los nombres de los elementos deben ser únicos dentro del area')

        area_id: int = self.dao_area.add_row(input)


        for area_image in input['images_listing']:
            print(area_image)
            if not self.dao_image.add_row({'file': area_image, 'good_id': area_id}):
                return error('No se pudieron agregar las imagenes ni los elementos al area')

        for element in input['element_listing']:
            element['area_id'] = area_id
            element_id: int = self.dao_element.add_row(element)

            print("ID DE ELEMENTO")
            print(element_id)

            if element_id:

                for element_image in element['images_listing']:

                    if not self.dao_image.add_row({'file': element_image, 'good_id': element_id}) :
                        return error('No se pudieron agregar las imagenes ni los elementos al area')

        return {
            'area_id': area_id
        }

    @staticmethod
    def retrieve_stories() -> list[object]:
        """"
            NOT USED FUNCTION
        """

        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP

        stories: list[object] = []

        stories_response = EStory.objects.all()

        for story in stories_response:
            if story is not None:
                stories.append({
                    'id': story.story_id,
                    'value': story.value,
                })

        return stories

    def retrieve_images(self, theatre_good_id: int) -> list[object]:
        """
        FUNCTION THAT RETRIEVES THE IMAGES OF AN THEATRE GOOD
        Args:
            theatre_good_id: IDENTIFER

        Returns:
            LIST OF IMAGES
        """

        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP

        images: list[object] = []

        images_response = self.dao_image.retrieve_rows({
            'tg_id': theatre_good_id
        })  # RETRIEVES ROWS FROM IMAGE DAO WITH AREA FILTER

        for image in images_response:
            if image is not None:
                images.append({
                    'id': image.image,
                    'name': image.name,
                    'source': image.value,
                })

        return images

    def retrieve_elements(self, area_id: str):
        """
        FUNCTION THAT RETRIEVES THE ELEMENT LISTING OF AN AREA
        Args:
            area_id: AREA ID

        Returns:
            LIST OF ELEMENT INFO
        """

        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP

        area_id_clean = int(area_id[1:])  # CLEANS THE AREA ID FOR DATABASE USAGE
        elements: list[object] = []

        elements_response = self.dao_element.retrieve_rows({
            'area_id': area_id_clean
        })  # RETRIEVES ROWS FROM ELEMENT DAO WITH AREA FILTER

        for element in elements_response:
            if element is not None:
                elements.append({
                    'id': area_id + '-' + str(element.info.id),
                    'name': element.info.name,
                    'location': element.info.location,
                    # 'parent_area': element.area.info.name
                })

        return elements

    def retrieve_areas(self) -> list:
        """
        FUNCTION THAT RETRIEVES THE AREA LISTING
        Returns:
        LIST OF AREA INFO
        """

        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP

        areas: list[object] = []

        database_response = self.dao_area.retrieve_rows()

        for area in database_response:
            if area is not None:
                areas.append({
                    'id': "A" + str(area.info.id),
                    'name': area.info.name,
                    'story': area.story.value,
                    'element_count': self.dao_element.retrieve_rows({'area_id': area.info.id}).count()
                })
        return areas

    def transfer_element(self, element_id: str, area_id: str) -> object:
        """
        FUNCTION THAT TRANSFER AN ELEMENT TO A DIFFERENT AREA
        Args:
            element_id: ELEMENT IDENTIFIER WITH FORMAT AX-X
            area_id: AREA IDENTIFIER WITH FORMAT AX

        Returns:
            NEW ELEMENT IDENTIFIER
        """

        # CHECKS FOR ASYNCIO EVENT LOOP
        check_event_loop()

        # CLEANS THE ELEMENT ID TO GET THE DATABASE IDENTIFIER
        cleaned_element_id: int = int(element_id.split("-")[1])

        # CLEANS THE AREA ID TO GET THE DATABASE IDENTIFIER
        cleaned_area_id: int = int(area_id.replace("A", ""))

        # CHECKS FOR THE EXISTENCE OF THE ELEMENT
        if not self.dao_element.retrieve_rows({'id': cleaned_element_id}).exists():
            return error("El elemento a transferir no existe")

        # CHECKS FOR THE EXISTENCE OF THE AREA
        if not self.dao_area.retrieve_rows({'id': cleaned_area_id}).exists():
            return error("El área de destino no existe")

        # TRIES TO UPDATE THE ELEMENT IN DATABASE
        if self.dao_element.update_row(cleaned_element_id, {"area_id": cleaned_area_id}):
            return {
                "element_id": area_id + "-" + str(cleaned_element_id)
            }
        else:
            return error("El elemento no pudo ser transferido")

    def retrieve_areas_for_report(self) -> list[object]:
        """
            Function that retrieves all elements and areas from the database for the report creation
        Returns:
            list[object] : Areas and elements list
        """

        check_event_loop()

        areas: list[object] = []

        areas_response = self.dao_area.retrieve_rows()

        if areas_response:
            for area in areas_response:
                if area:
                    area_object = {
                        'id': "A" + str(area.info.id),
                        'description': area.info.description,
                        'location': area.info.location,
                        'name': area.info.name,
                        'story': area.story.value,
                        'images_listing': self.retrieve_images(area.info.id),
                        'element_listing': [],
                    }

                    check_event_loop()

                    element_response = self.dao_element.retrieve_rows({
                        'area_id': area.info.id
                    })

                    if element_response:
                        for element in element_response:
                            if element:
                                area_object['element_listing'].append({
                                    'id': "A" + str(area.info.id) + '-' + str(element.info.id),
                                    'description': element.info.description,
                                    'location': element.info.location,
                                    'name': element.info.name,
                                    'images_listing': self.retrieve_images(element.info.id),
                                })
                    areas.append(area_object)
        return areas

    def retrieve_full_elements(self, area_id: str) ->  list[object]:
        """
        FUNCTION THAT RETRIEVES THE DETAIL OF THE ELEMENTS OF AN AREA
        Args:
            area_id: AREA ID

        Returns:
            LIST OF ELEMENT DETAIL
        """
        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP

        area_id_clean = int(area_id[1:])  # CLEANS THE AREA ID FOR DATABASE USAGE
        elements: list[object] = []

        elements_response = self.dao_element.retrieve_rows({
            'area_id': area_id_clean
        })  # RETRIEVES ROWS FROM ELEMENT DAO WITH AREA FILTER

        print(elements_response)

        for element in elements_response:
            if element is not None:
                elements.append({
                    'id': area_id + '-' + str(element.info.id),
                    'description': element.info.description,
                    'location': element.info.location,
                    'name': element.info.name,
                    'images_listing': self.retrieve_images(element.info.id),
                })

        return elements

    def get_full_area(self, id: str) -> object:
        """
        FUNCTION THAT RETRIEVES ALL THE INFORMATION ABOUT AN AREA TO MODIFY IT
        Args:
            id:

        Returns:

        """

        if not re.match(r'A([0-9])+$', id):
            return error('El área a consultar no posee un formato de identificación correcto.')

        check_event_loop()
        area_id_clean = int(id[1:])

        database_response = self.dao_area.retrieve_rows({'id': area_id_clean})
        print(area_id_clean)

        if database_response:
            print(database_response)
            area = database_response.first()
            return {
                'id': "A" + str(area.info.id),
                'description': area.info.description,
                'location': area.info.location,
                'name': area.info.name,
                'story': area.story.value,
                'images_listing': self.retrieve_images(area.info.id),
                'element_listing': self.retrieve_full_elements(id),
            }
        else:
            return error('El área consultada no existe')

    def get_element(self, id: str) -> object:
        """
        FUNCTION THAT RETRIEVES AN ELEMENT DETAIL
        Args:
            id: ELEMENT ID

        Returns:
            ELEMENT DETAIL
        """

        if not re.match('A\d+-\d+$', id):
            return error('El elemento consultado no posee un formato de identificación correcto.')

        check_event_loop()

        element_id_clean: int = int(id[1:].split('-')[1])

        database_response = self.dao_element.retrieve_rows({'id': element_id_clean})

        if database_response:
            element = database_response.first()
            return {
                'id': "A" + str(element.area.info.id) + '-' + str(element.info.id),
                'description': element.info.description,
                'location': element.info.location,
                'name': element.info.name,
                'images_listing': self.retrieve_images(element.info.id),
                'parent_area': element.area.info.name
            }
        else:
            return error('El elemento consultado no existe')

    def get_area(self, id: str) -> object:
        """
        FUNCTION THAT RETRIEVES THE AREA INFORMATION OF THE GIVEN AREA
        Args:
            id: AREA ID

        Returns:
            AREA DETAIL OR ERROR IF ANY
        """

        if not re.match(r'A([0-9])+$', id):
            return error('El área consultada no posee un formato de identificación correcto.')

        check_event_loop()

        area_id_clean = int(id[1:])

        print(area_id_clean)

        database_response = self.dao_area.retrieve_rows({'id': area_id_clean})

        if database_response:
            print(database_response)
            area = database_response.first()
            return {
                'id': "A" + str(area.info.id),
                'description': area.info.description,
                'location': area.info.location,
                'name': area.info.name,
                'story': area.story.value,
                'images_listing': self.retrieve_images(area.info.id),
                'element_listing': self.retrieve_elements(id),
            }
        else:
            return error('El área consultada no existe')

    def delete_area(self, id: str) -> object:
        """
        FUNCTION THAT DELETES THE AREA IDENTIFIED WITH THE GIVEN ID
        Args:
            id: AREA ID

        Returns:
            ERROR MESSAGES IF ANY
        """

        if not re.match(r'A([0-9])+$', id):
            return error('El área a eliminar no posee un formato de identificación correcto')

        area_id_clean: int = int(id[1:])

        check_event_loop()

        if self.dao_area.delete_row(area_id_clean):
            return {
                'response': False
            }
        else:
            return error('No se pudo eliminar el área seleccionada')

    def modify_area(self, input: dict) -> object:
        """
        FUNCTION THAT MODIFIES AN AREA AND IT SUB MODELS
        Args:
            input: NEW, DELETED AND MODIFIED INFORMATION

        Returns:
            ERROR IF ANY
        """

        if not re.match(r'A([0-9])+$', input['id']):
            return error('El área a modificar no posee un formato de identificación correcto')

        area_id_clean: int = int(input['id'][1:])

        area_test = self.dao_area.retrieve_rows({'id': area_id_clean})

        print(area_test)

        # CHECKS THAT THE AREA TO BE MODIFIED EXISTS
        if area_test.exists():
            area = area_test.first()
            if area.info.name != input['name']:
                if Area.objects.filter(info__name=input['name']).exists():
                    return error('Un área con el nuevo nombre ya existe, por favor elige otro')
            print("364")
            # CHECK NEW ELEMENTS NAMES

            if Element.objects.filter(area_id=area_id_clean, info__name__in=[x['name'] for x in input['created_elements']]).exists():
                return error(
                    'Uno o más elementos a crear, tienen un nombre ya existente en el área, por favor elige otro')
            print("370")
            # AREA MODIFICATION

            found_error: bool = False

            print('here')

            if self.dao_area.update_row(area_id_clean, input):
                # DELETES DELETED IMAGES FROM S3 AND DB
                print("379")
                if input['deleted_images']:
                    for deleted_image in input['deleted_images']:
                        print("deleted images")
                        if not self.dao_image.delete_row(deleted_image):
                            found_error = True
                # CREATES IMAGES IN S3 AND DB
                print("385")
                if input['created_images']:
                    for created_image in input['created_images']:
                        if not self.dao_image.add_row({
                            'good_id': area_id_clean,
                            'file': created_image
                        }):
                            found_error = True
                # DELETES SELECTED ELEMENTS
                print("391")
                if input['deleted_elements']:
                    for deleted_element in input['deleted_elements']:
                        element_id_clean: int = int(deleted_element[1:].split('-')[1])
                        if not self.dao_element.delete_row(element_id_clean):
                            found_error = True
                # MODIFIES SELECTED ELEMENTS
                if input['created_elements']:
                    print("401")
                    for created_element in input['created_elements']:
                        created_element['area_id'] = area_id_clean
                        element_id: int or None = self.dao_element.add_row(created_element)

                        print("406")
                        if not element_id:
                            found_error = True
                            continue

                        print("411")
                        for created_image in created_element['images_listing']:
                            self.dao_image.add_row({
                                'good_id': element_id,
                                'file': created_image
                            })
                        print("420")
                if input['modified_elements']:
                    for modified_element in input['modified_elements']:
                        element_id_clean: int = int(modified_element['id'][1:].split('-')[1])
                        if not self.dao_element.update_row(element_id_clean, modified_element):
                            found_error = True
                        print("425")
                        for deleted_image in modified_element['deleted_images']:
                            self.dao_image.delete_row(deleted_image)
                        print("428")
                        for created_image in modified_element['created_images']:
                            self.dao_image.add_row({
                                'good_id': element_id_clean,
                                'file': created_image
                            })
                        print("434")
                if found_error:
                    return error(
                        'Hubieron múltiples errores en la modifcación del área favor revisa los datos ingresados.')
                else:
                    return {
                        'response': False
                    }
            else:
                return error("No se pudo modificar el área")
        else:
            return error('El area a mmodificar no existe')
