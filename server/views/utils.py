from flask import session
import requests
from .. import app
from pprint import pprint


def user_info(request):
    if session.get('user', None) is None:
        cookie_name = app.config.get('REMEMBER_COOKIE_NAME', 'muprsns')
        auth_base_url = app.config.get('MOL_AUTH_BASE_URL', 'https://auth.mol.org/')
        if cookie_name in request.cookies:
            auth_token = request.cookies[cookie_name]
            payload = {'auth_token': auth_token}
            r = requests.get('%s/api/me' % auth_base_url, params=payload, timeout=30)
            if r.status_code == 200:
                current_user = r.json()
                if not current_user['fullname']:
                    if current_user['firstname']:
                        current_user['fullname'] = current_user['firstname']
                    if current_user['lastname']:
                        current_user['fullname'] += ' %s' % current_user['lastname']
                current_user['fullname'] = current_user['fullname'].strip()
                session['user'] = current_user
    return session.get('user', None)
