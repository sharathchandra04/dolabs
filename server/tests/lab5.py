from utils import utils, awsutils, dockerutils

hd = utils.gethomedir()
def l5stask1(ansers):
    return True

def l5stask2(answers):
    return True

def l5stask3(answers):
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    hw1 = utils.filter_dicts(conts, {"Name": 'hw1', "Status": "exited"})
    hw2 = utils.filter_dicts(conts, {"Name": 'hw2', "Status": "exited"})
    if len(hw2) != 1 : return False
    if len(hw1) != 1 : return False
    logs = dockerutils.get_container_logs_last_minute(hw2[0]['ID'])
    sol = utils.read_file(f'{hd}/task3.txt')
    if not sol["success"]: return False
    if sol["output"].strip() == str(logs).strip():
        print(hw1, hw2)
        return True
    return False

def l5stask4(answers):
    return True

def l5stask5(answers):
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    nginx = utils.filter_dicts(conts, {"Name": 'nginxcont'})
    ubc = utils.filter_dicts(conts, {"Name": 'ubc', "Status": "running"})
    if len(nginx) != 1 : return False
    if len(ubc) != 1 : return False
    ans5151 = answers['5151']
    ans5152 = answers['5152']
    ubcips  = dockerutils.get_container_ip_addresses(ubc[0]['ID'])
    if ubcips == None: return False
    if ans5151 == nginx[0]['ID'] and str(ans5152).strip() in ubcips.values():
        return True
    return False

def l5stask6(answers):
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    hw1 = utils.filter_dicts(conts, {"Name": 'hw1'})
    hw2 = utils.filter_dicts(conts, {"Name": 'hw2'})
    if len(hw2) > 0 : return False
    if len(hw1) > 1 : return False
    return True

def l5stask7(answers):
    images = dockerutils.list_docker_images()
    tags = []
    for i in images: tags.extend(i["Tags"])
    if 'mysql:latest' in tags and 'httpd:latest' in tags:
        return True
    return False

def l5stask8(answers):
    return True

def l5stask9(answers):
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    if len(conts) > 0: return False
    return True

def l5stask10(answers):
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    ubc = utils.filter_dicts(conts, {"Name": 'thiswillexit', "Status": "exited" })
    if len(ubc) != 1: return False
    return True
    
def l5stask11(answers):
    return True

def l5stask12(answers):
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    if len(conts) > 0: return False
    return True

def l5stask13(answers):
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    ubc = utils.filter_dicts(conts, {"Name": 'myubn', "Status": "running" })
    if len(conts) != 1: return False
    ec, o = dockerutils.exec_command_in_container(ubc[0]['ID'], 'curl --version')
    if not(ec == 0 and 'curl' in o.strip()): return False
    ec, o = dockerutils.exec_command_in_container(ubc[0]['ID'], 'cat /hello-docker.txt')
    if not(ec == 0 and 'Hello, Docker!' == o.strip()): return False
    return True

def l5stask14(answers):
    images = dockerutils.list_docker_images()
    tags = []
    for i in images: tags.extend(i["Tags"])
    if not('myubn-image:latest' in tags): return False
    conts = dockerutils.list_docker_containers()
    if conts == None: return False
    ubc = utils.filter_dicts(conts, {"Name": 'myubn', "Status": "running" })
    if len(ubc) == 1: return False
    return True

def l5stask15(answers):
    return True

def l5stask16(answers):
    return True

def l5stask17(answers):
    return True
