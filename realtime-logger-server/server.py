from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from flask import Flask, render_template
from flask_socketio import SocketIO
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

previous_number_of_lines = 0

@app.route("/healthcheck")
def healthcheck():
    return "Server is running"

@socketio.on("connect")
def handle_connect():
    global previous_number_of_lines
    print("Client connected")

    with open("app.log", "r") as f:
        fileLines = f.readlines()
        previous_number_of_lines = len(fileLines)
        socketio.emit("file-change", "".join(fileLines[-10:]))

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global previous_number_of_lines
        # print(f'event type: {event.event_type}  path : {event.src_path}')

        if event.src_path.find("app.log") != -1:
            with open(event.src_path, "r") as f:
                fileLines = f.readlines()
                curr_number_of_lines = len(fileLines)
                if curr_number_of_lines > previous_number_of_lines:
                    socketio.emit("file-change", "".join(fileLines[previous_number_of_lines:]))
                    previous_number_of_lines = curr_number_of_lines


def observeFileChange():
    path = "."
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path)
    observer.start()
    try:
        while observer.is_alive():
            observer.join(1)
    finally:
        observer.stop()
        observer.join()


if __name__ == "__main__":
    observer_thread = threading.Thread(target=observeFileChange)
    observer_thread.start()

    print("Starting server...")

    socketio.run(app, host="localhost", port=5000, allow_unsafe_werkzeug=True)