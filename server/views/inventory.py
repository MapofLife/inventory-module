import requests
from flask import render_template, flash, redirect, request, Markup
from flask import url_for, jsonify, current_app as app

from .. import app
import utils as util


@app.route('/inventory')
def inventory():
    return render_template('html/index.html')
