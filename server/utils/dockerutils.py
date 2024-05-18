from docker.errors import DockerException
import docker
import datetime

def get_container_volumes(container_id):
    try:
        client = docker.from_env()
        container = client.containers.get(container_id)
        container_volumes = container.attrs['HostConfig']['Binds']
        print(f"Volumes associated with container {container_id}:")
        for volume in container_volumes:
            print(volume)
    except docker.errors.NotFound:
        print(f"Container {container_id} not found.")
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")

def list_docker_containers():
    client = docker.from_env()
    containers = client.containers.list(all=True)
    for container in containers:
        print(f"ID: {container.id}")
        print(f"Name: {container.name}")
        print(f"Status: {container.status}")
        print(f"Image: {container.image.tags}")
        print("-" * 40)


def list_docker_volumes():
    try:
        client = docker.from_env()
        volumes = client.volumes.list()
        for volume in volumes:
            print(f"Name: {volume.name}")
            print(f"Driver: {volume.attrs['Driver']}")
            print(f"Mountpoint: {volume.attrs['Mountpoint']}")
            print(f"Labels: {volume.attrs.get('Labels', 'None')}")
            print("-" * 40)
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")

def get_container_id_by_name(container_name):
    try:
        client = docker.from_env()
        containers = client.containers.list(filters={"name": container_name})
        if containers:
            return containers[0].id
        else:
            print(f"No container found with name '{container_name}'")
            return None
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None

def get_container_by_id(container_id):
    try:
        client = docker.from_env()
        container = client.containers.get(container_id)
        return container
    except docker.errors.NotFound:
        print(f"Container with ID '{container_id}' not found.")
        return None
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None

def get_container_network(container_id):
    try:
        client = docker.from_env()
        container = client.containers.get(container_id)
        networks = container.attrs['NetworkSettings']['Networks']
        return networks
    except docker.errors.NotFound:
        print(f"Container with ID '{container_id}' not found.")
        return None
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None
def get_container_logs_last_minute(container_id):
    try:
        client = docker.from_env()
        current_time = datetime.datetime.now()
        one_minute_ago = current_time - datetime.timedelta(minutes=1)
        container = client.containers.get(container_id)
        logs = container.logs(since=one_minute_ago.timestamp()).decode("utf-8")
        return logs
    except docker.errors.NotFound:
        print(f"Container with ID '{container_id}' not found.")
        return None
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None

def list_docker_images():
    try:
        client = docker.from_env()
        images = client.images.list()
        return images
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None

def get_container_port_mappings(container_id):
    try:
        client = docker.from_env()
        container = client.containers.get(container_id)
        ports = container.attrs['NetworkSettings']['Ports']
        return ports
    except docker.errors.NotFound:
        print(f"Container with ID '{container_id}' not found.")
        return None
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None

def execute_command_in_container(container_id, command):
    try:
        client = docker.from_env()
        exec_response = client.containers.exec_run(container_id, command)
        return exec_response.output.decode("utf-8")
    except docker.errors.NotFound:
        print(f"Container with ID '{container_id}' not found.")
        return None
    except DockerException as e:
        print(f"Error executing command in container: {e}")
        return None