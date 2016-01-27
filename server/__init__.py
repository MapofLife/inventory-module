import os
import logging

from flask import Flask, request, g

app = Flask(__name__)
app.config.from_object('config')

from . import views, filters
from views import utils

app.jinja_env.filters['format_datetime'] = filters.filter_format_datetime
app.jinja_env.filters['format_timedelta'] = filters.filter_format_timedelta
app.jinja_env.filters['format_remote_url'] = filters.filter_remote_url


@app.before_request
def check_user_login_status():
    g.user = utils.user_info(request)
