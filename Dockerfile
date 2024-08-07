# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY server /app/server
COPY labs /app/labs

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r server/requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000
WORKDIR /app/server

# Define environment variable
ENV FLASK_APP=server.py
ENV FLASK_ENV=development

# Run server.py when the container launches
CMD ["python", "-u", "server.py"]

