from os import name as os_name
import sys

from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application

# prevent ioloop exception on windows for python 3.8
if sys.version_info.major >= 3 and sys.version_info.minor >= 8 and os_name == "nt":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# get port as argument
PORT = sys.argv[1]
# PORT = 8888


data = {
    "server": "http://127.0.0.1",
    "port": PORT
}


class GetData(RequestHandler):
    def set_default_headers(self):
        self.set_header('Content-Type', 'application/json')

    def get(self):
        response = dict()
        response['data'] = data
        self.write(response)


def write_out(str):
    sys.stdout.write(str)


def make_app():
    return Application([
        (r"/getData", GetData)
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(PORT)
    write_out('Server listening on port ' + str(PORT))
    IOLoop.current().start()
