total_tasks = 2
test_tasks = {
    # "task1": {"n": 6, "tests": 5, "tindexi": [2, 3, 4, 5, 6]},
    # "task2": {"n": 8, "tests": 4, "tindexi": [4, 5, 6, 7, 8]},
}
# from dolabs.server.utils.utils import *
from utils import utils
# both are same
def task1():
    imap = {}
    hd = utils.gethomedir()
    taskd = 'Lab3Task1'
    def stask3():
        co = utils.execute_command(f'apt search nginx')
        sol = utils.read_file(f'{hd}/{taskd}/sols/task3.txt')
        print(co['output'])
        print(sol['output'])
        if co["success"] and sol["success"]:
            return co["output"] == sol["output"].strip()
        else:
            return False
    def stask4():
        co = utils.execute_command(f'dpkg -l nginx')
        if co["success"] and 'nginx' in co["output"]:
            return True
        else:
            return False
    def stask5():
        r1 = (utils.file_exists(f'{hd}/{taskd}/sols/README.md'))
        d = utils.read_file(f'{hd}/{taskd}/sols/README.md')
        if d['success'] and 'Patching guidelines' in d['output'] and r1:
            return True
        return False
    def stask6():
        r1 = (utils.file_exists(f'{hd}/{taskd}/sols/tensorflow.md'))
        d = utils.read_file(f'{hd}/{taskd}/sols/tensorflow.md')
        if d['success'] and 'Patching guidelines' in d['output'] and r1:
            return True
        return False
    imap[3] = stask3()
    imap[4] = stask4()
    imap[5] = stask5()
    imap[6] = stask6()
    return imap

def task2():
    imap = {}
    # hd = gethomedir()
    # taskd = 'Lab3Task2'
    def stask1():
        co = utils.execute_command(f'dpkg -l nginx')
        if co["success"] and 'nginx' in co["output"]:
            return True
        else:
            return False
    
    imap[1] = stask1()
    return imap

def task3():
    return {}