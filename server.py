from os import name as os_name
import sys

from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application
import json
import random
import string

# prevent ioloop exception on windows for python 3.8
if sys.version_info.major >= 3 and sys.version_info.minor >= 8 and os_name == "nt":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# get port as argument
PORT = sys.argv[1]


def write_out(str):
    sys.stdout.write(str)


class GetDataHandler(RequestHandler):
    def set_default_headers(self):
        self.set_header('Content-Type', 'application/json')

    def get(self):
        response = dict()
        response['data'] = get_random_data()
        self.write(response)


def get_random_data():
    arr = []
    n = random.randrange(10, 50)
    for i in range(0, n):
        arr.append(generate_id())
    return arr

# function generating random item id


def generate_id(size=12, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def make_app():
    return Application([
        (r"/getData", GetDataHandler)
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(PORT)
    write_out('Server listening on port ' + str(PORT))
    IOLoop.current().start()
