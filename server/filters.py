import urllib
import urlparse
from datetime import datetime, time
from dateutil.parser import parse

from babel.dates import format_date, format_datetime, format_time
from babel.dates import timedelta, format_timedelta


def filter_remote_url(url):
    parts = urlparse.urlsplit(url)
    scheme = parts.scheme
    netloc = parts.netloc
    if netloc.endswith(':8080'):
        netloc = netloc[:-1] + '1'
    return '{0}://{1}'.format(scheme, netloc)


def filter_format_datetime(value):
    dt = parse(value)
    dts = format_datetime(dt, format='medium', locale='en')
    return dts


def filter_format_timedelta(value):
    dt = parse(value)
    dts = format_timedelta(dt - datetime.now(dt.tzinfo), format='medium', locale='en')
    return dts
