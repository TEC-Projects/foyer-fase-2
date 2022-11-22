from django.conf import settings
from django.core.mail import send_mail, EmailMessage

from Foyer.Util.GeneralUtil import format_user_type


class EmailServices:

    def __init__(self):
        '''
        Constructor method for the EmailServices class
        '''
        super().__init__()

    def email(self, subject, message, email):
        '''
        Method that contains the logic to send an email to a specific user with a specific subject and message
        '''
        email_from = f"Foyer: Conservación patrimonial <{settings.EMAIL_HOST_USER}>"
        recipient_list = [email]
        send_mail(subject, message, email_from, recipient_list)
        return True

    def email_created_user(self, email, password, type):
        '''
        Method that contains the logic to send an email to a new user with their temporary password
        '''
        subject: str = '¡Bienvenido a la plataforma! - Foyer'
        from_email: str = f"Equipo de Foyer <{settings.EMAIL_HOST_USER}>"
        message: str = f'<br><img width="300" height="86" src="https://foyer-administration.s3.amazonaws.com/static/golden_main_logo.png" alt="Logo de Foyer">' \
                       f'<br><br><br>Bienvenido a la plataforma Foyer: Conservación Patrimonial, <strong>has sido registrado/a como {format_user_type(type)} del sistema exitosamente</strong>.' \
                       f'<br><br>Estamos muy emocionados que te integres al equipo Foyer. Tu cuenta está lista, y tu contraseña temporal es: ' \
                       f'<br><br> <strong>{password}</strong> ' \
                       f'<br><br>¡Recordá que al ingresar por primera vez debes de cambiar tu contraseña! <a href="https://master.d99b9f7osogap.amplifyapp.com/" target="_blank">Para iniciar sesión haz click aquí.<a/>' \
                       f'<br><br> Atentamente,' \
                       f'<br><br>Equipo de Foyer' \
                       f'<br>San José, Costa Rica.'

        mail = EmailMessage(subject, message, from_email, [email])
        mail.content_subtype = 'html'
        mail.send()

    def email_recover_password(self, email, token):
        '''
        Method that contains the logic to send an email to a user with their recovery code
        '''
        subject: str = 'Recuperación de contraseña - Foyer'
        from_email: str = f"Equipo de Foyer <{settings.EMAIL_HOST_USER}>"
        message: str = f'<br><img width="300" height="86" src="https://foyer-administration.s3.amazonaws.com/static/golden_main_logo.png" alt="Logo de Foyer">' \
                       f'<br><br><br> Hemos recibido tu solicitud de cambio de contraseña, tu token de recuperación es:' \
                       f'<br><br> <strong>{token}</strong> ' \
                       f'<br><br>Si no reconoces esta acción contacta de inmediato nuestro servicio de protección usuarios de servicios en línea.' \
                       f'<br><br> Atentamente,' \
                       f'<br><br>Equipo de Foyer' \
                       f'<br>San José, Costa Rica.'

        mail = EmailMessage(subject, message, from_email, [email])
        mail.content_subtype = 'html'
        mail.send()

EmailServices.__doc__ = 'Class that contains the logic to send emails to users'
