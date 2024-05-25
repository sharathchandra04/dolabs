from docker.errors import DockerException
import docker
import datetime
import requests

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
    l = []
    for container in containers:
        print(container)
        l.append({
              "ID": container.id,
              "Name": container.name,
              "Status": container.status,
              "Image": container.image.tags
        })
    return l


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
        container = client.containers.get(container_id)
        logs = container.logs().decode("utf-8")
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
        image_details = []
        for image in images:
            details = {
                "ID": image.id,
                "Tags": image.tags,
                "Created": image.attrs['Created'],
                "Size": image.attrs['Size'],
                "Labels": image.attrs['Config'].get('Labels', {})
            }
            image_details.append(details)
        return image_details
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
def check_tag_exists(username, repository, tag):
    url = f"https://hub.docker.com/v2/repositories/{username}/{repository}/tags/"
    response = requests.get(url)
    if response.status_code == 200:
        tags = response.json()["results"]
        for t in tags:
            if t["name"] == tag:
                return True
        return False
    elif response.status_code == 404:
        return False
    else:
        return False
    # sharathchandra04/sharathchandra04:sshservercat
    # username = "sharathchandra04"
    # repository = "sharathchandra04"
    # tag = "sshservercat"
    # tag_exists = check_tag_exists(username, repository, tag)
    # print(f"Tag exists: {tag_exists}")
def get_container_ip_addresses(container_id):
    try:
        client = docker.from_env()
        container = client.containers.get(container_id)
        networks = container.attrs['NetworkSettings']['Networks']
        ip_addresses = {}
        for network_name, network_info in networks.items():
            ip_address = network_info.get('IPAddress', 'N/A')
            ip_addresses[network_name] = ip_address
        return ip_addresses
    except docker.errors.NotFound:
        print(f"Container with ID '{container_id}' not found.")
        return None
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None

def exec_command_in_container(container_id, command):
    try:
        client = docker.from_env()
        container = client.containers.get(container_id)
        exec_instance = container.exec_run(command)
        exit_code, output = exec_instance
        if exit_code == 0:
            return exit_code, output.decode('utf-8')
        else:
            return exit_code, None
    except DockerException as e:
        print(f"Error connecting to Docker: {e}")
        return None, str(e)
    