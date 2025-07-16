FROM python:3.13.5-slim-bookworm
COPY requirements.txt /tmp
RUN apt update && apt install -y sqlite3
RUN pip install --no-cache-dir -r /tmp/requirements.txt
