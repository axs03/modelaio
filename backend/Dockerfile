FROM python:3.13

WORKDIR /server

COPY . .
RUN pip install uv 
RUN uv pip install --system -r req.txt 

EXPOSE 8000

CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]
