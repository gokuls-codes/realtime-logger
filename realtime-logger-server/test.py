import time

from random import randrange

fileLines = []
with open("app.log", "r") as f:
    fileLines = f.readlines()[:10]

for i in range(100):
    with open("app.log", "a") as f:
        lineToWrite = fileLines[randrange(10)]
        f.write(f"Line: {i + 1} {lineToWrite}")
        
        time.sleep(1)