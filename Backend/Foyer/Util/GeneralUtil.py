import asyncio
import random
import string
import boto3
import uuid

BUCKET = 'foyer-administration'
S3_BASE_URL = 's3.amazonaws.com'
aws_access_key_id = 'AKIASPXV45EC2M6N4UT7'
aws_secret_access_key = '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'


def check_event_loop():
    try:
        asyncio.get_running_loop()
    except Exception as e:
        asyncio.set_event_loop(asyncio.new_event_loop())


def error(out: str) -> object:
    return {
        'response': True,
        'message': out
    }


def upload_file(file: any) -> str or None:
    if file:
        s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
        key = uuid.uuid4().hex + file.name[file.name.rfind('.'):]

        try:
            s3.upload_fileobj(file, BUCKET, key)
            return f"https://{BUCKET}.{S3_BASE_URL}/{key}"
        except Exception as err:
            print(err.__str__())
            return None
    return None

def delete_file(id: any) -> bool:
    if id:
        try:
            s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
            s3.delete_object(Bucket=BUCKET, Key=id.replace(f"https://{BUCKET}.{S3_BASE_URL}", ""))
            return True
        except Exception as e:
            e.__str__()
            return False
    else:
        return False

def convert_story_name_to_id(story: str) -> int:
    if story == 'BASEMENT':
        return 0
    elif story == 'FIRST':
        return 1
    elif story == 'SECOND':
        return 2
    elif story == 'THIRD':
        return 3
    elif story == 'OUTSIDE':
        return 4

def format_user_type(user_type: str) -> str:
    if user_type == 'ADMIN_USER':
        return 'ADMINISTRADOR'
    elif user_type == 'OPERATIVE_USER':
        return 'OPERATIVO'

class GeneralUtil:

    def generate_password(self, length):
        '''
        Method that generates a random number of characters of the length specified
        '''
        return ''.join(random.choice(string.digits) for _ in range(length))
