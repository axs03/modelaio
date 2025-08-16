FROM python:3.13

WORKDIR /server

COPY . .
RUN pip install -r req.txt

CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]
