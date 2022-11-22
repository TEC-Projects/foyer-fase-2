from __future__ import annotations
from django.db.models.query import QuerySet
from django.db import connection

from Foyer.Models.DAO import IDAO
from Foyer.Models.SupervisionDraft import SupervisionDraft
from Foyer.Models.SupervisionDraftSpoilageAgent import SupervisionDraftSpoilageAgent
from Foyer.Models.ESupervisionResult import Actions
from Foyer.Util.GeneralUtil import upload_file, delete_file


class SupervisionDraftDAO(IDAO):
    def add_row(self, data: dict) -> int | None:
        with connection.cursor() as cursor:
            action = Actions.objects.get(value=data['suggested_action']).actions_id
            cursor.execute('INSERT INTO SUPERVISION_DRAFT(SUPERVISION_DRAFT_ID, ACTION_ID) VALUES (%s, %s)',
                           [data['id'], action])

            # CREATED DAMAGES

            for eachDamage in data['created_damages']:
                if len(eachDamage['image']) != 0:
                    source = upload_file(eachDamage['image'][0])
                    name = eachDamage['image'][0].name
                    eachDamage['image'] = [{'source': source, 'name': name}]
                else:
                    eachDamage['image'] = [{'source': None, 'name': None}]

                cursor.execute(
                    'INSERT INTO SUPERVISION_DRAFT_SPOILAGE_AGENT(SUPERVISION_DRAFT_ID, SPOILAGE_AGENT_ID, IMAGE_URL, IMAGE_NAME, REMARKS, SUGGESTED_TREATMENT) VALUES (%s, %s, %s, %s, %s, %s)',
                    [data['id'], eachDamage['spoilage_agent_id'], eachDamage['image'][0]['source'],
                     eachDamage['image'][0]['name'], eachDamage['observations'], eachDamage['recommendations']])

        return data['id']

    def delete_row(self, id: int) -> bool:
        SupervisionDraft.objects.get(supervision_draft_id=id).delete()
        return True

    def retrieve_rows(self, filter: dict) -> object:
        base_draft = SupervisionDraft.objects.get(supervision_draft_id=filter['id'])
        spoilage_agents: list = []
        spoilage_agents_database = SupervisionDraftSpoilageAgent.objects.filter(
            supervision_draft__supervision_draft_id=filter['id'])
        if spoilage_agents_database:
            for each_spoilage_agent in spoilage_agents_database:
                image: list
                if each_spoilage_agent.image_url:
                    image = [{
                        'source': each_spoilage_agent.image_url,
                        'name': each_spoilage_agent.image_name}]
                else:
                    image = []
                spoilage_agents.append({
                    'id': each_spoilage_agent.supervision_draft_spoilage_agent_id,
                    'spoilage_agent_id': each_spoilage_agent.spoilage_agent.spoilage_agent_id,
                    'observations': each_spoilage_agent.remarks,
                    'recommendations': each_spoilage_agent.suggested_treatment,
                    'image': image
                })
        return {
            'id': filter['id'],
            'suggested_action': base_draft.action.value,
            'has_draft_been_found': True,
            'damage_listing': spoilage_agents
        }

    def update_row(self, id: int, data: dict) -> bool:
        with connection.cursor() as cursor:
            action = Actions.objects.get(value=data['suggested_action']).actions_id
            cursor.execute('UPDATE SUPERVISION_DRAFT SET ACTION_ID = %s WHERE SUPERVISION_DRAFT_ID = %s;',
                           [action, id])
            # CREATED DAMAGES

            for eachDamage in data['created_damages']:
                if len(eachDamage['image']) != 0:
                    source = upload_file(eachDamage['image'][0])
                    name = eachDamage['image'][0].name
                    eachDamage['image'] = [{'source': source, 'name': name}]
                else:
                    eachDamage['image'] = [{'source': None, 'name': None}]

                cursor.execute(
                    'INSERT INTO SUPERVISION_DRAFT_SPOILAGE_AGENT(SUPERVISION_DRAFT_ID, SPOILAGE_AGENT_ID, IMAGE_URL, IMAGE_NAME, REMARKS, SUGGESTED_TREATMENT) VALUES (%s, %s, %s, %s, %s, %s)',
                    [data['id'], eachDamage['spoilage_agent_id'], eachDamage['image'][0]['source'],
                     eachDamage['image'][0]['name'], eachDamage['observations'], eachDamage['recommendations']])

            # DELETED DAMAGES

            for eachDamage in data['deleted_damages']:
                SupervisionDraftSpoilageAgent.objects.get(supervision_draft_spoilage_agent_id=eachDamage).delete()

            # UPDATED DAMAGES

            for eachDamage in data['updated_damages']:

                # IMAGE REMOVED

                if eachDamage['has_image_been_removed']:
                    delete_file(SupervisionDraftSpoilageAgent.objects.get(
                        supervision_draft_spoilage_agent_id=eachDamage['id']).image_url)
                    cursor.execute(
                        'UPDATE SUPERVISION_DRAFT_SPOILAGE_AGENT SET IMAGE_URL = NULL, IMAGE_NAME = NULL WHERE SUPERVISION_DRAFT_SPOILAGE_AGENT_ID = %s',
                        [eachDamage['id']]
                    )

                # NEW IMAGE

                if len(eachDamage['image']) != 0:
                    source = upload_file(eachDamage['image'][0])
                    print(source)
                    name = eachDamage['image'][0].name
                    cursor.execute(
                        'UPDATE SUPERVISION_DRAFT_SPOILAGE_AGENT SET SPOILAGE_AGENT_ID = %s, IMAGE_URL = %s, IMAGE_NAME = %s, REMARKS = %s, SUGGESTED_TREATMENT = %s WHERE SUPERVISION_DRAFT_SPOILAGE_AGENT_ID = %s',
                        [eachDamage['spoilage_agent_id'], source, name, eachDamage['observations'],
                         eachDamage['recommendations'], eachDamage['id']])
                else:
                    cursor.execute(
                        'UPDATE SUPERVISION_DRAFT_SPOILAGE_AGENT SET SPOILAGE_AGENT_ID = %s, REMARKS = %s, SUGGESTED_TREATMENT = %s WHERE SUPERVISION_DRAFT_SPOILAGE_AGENT_ID = %s',
                        [eachDamage['spoilage_agent_id'], eachDamage['observations'], eachDamage['recommendations'],
                         eachDamage['id']])

        return True
