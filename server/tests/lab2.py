total_tasks = 2
test_tasks = {
    "task1": {"n": 6, "tests": 5, "tindexi": [2, 3, 4, 5, 6]},
    "task2": {"n": 8, "tests": 4, "tindexi": [4, 5, 6, 7, 8]},
}
# from dolabs.server.utils.utils import *
import os
from utils import utils
# both are same
def task1():
    imap = {}
    hd = utils.gethomedir()
    taskd = 'Lab2Task1'
    def stask2():
        r1 = utils.file_exists(f'{hd}/{taskd}/sols/cpfile.txt')
        r2 = utils.directory_exists(f'{hd}/{taskd}/sols/cpdir')
        return r1 and r2
    def stask3():
        r = (utils.file_exists(f'{hd}/{taskd}/sols/mvfile.txt'))
        return r
    def stask4():
        if not os.path.exists(f'{hd}/{taskd}/rmfile.txt'):
            return True
        return False
    def stask5():
        if not os.path.exists(f'{hd}/{taskd}/rmdir'):
            return True
        return False
    def stask6():
        co = utils.execute_command(f'ls -la ~/{taskd}')
        sol = utils.read_file(f'{hd}/{taskd}/sols/task6.txt')
        print(co['output'])
        print(sol['output'])
        if co["success"] and sol["success"]:
            return co["output"] == sol["output"].strip()
        else:
            return False
    imap[2] = stask2()
    imap[3] = stask3()
    imap[4] = stask4()
    imap[5] = stask5()
    imap[6] = stask6()
    return imap

def task2():
    imap = {}
    hd = utils.gethomedir()
    taskd = 'Lab2Task2'
    def stask3():
        co = utils.execute_command(f'ls -l {hd}/{taskd}/')
        if co["success"] and 'link_to_task3dir_in_filetypes' in co['output']: 
            return True
        else:
            return False
    def stask4():
        co = utils.execute_command(f'find {hd}/{taskd}/ -name task*')
        sl = ["task1.txt", "task2.txt", "task3.txt", "task4.txt"]
        if co["success"] and all(st in co["output"] for st in sl):
            return True
        else:
            return False
    def stask7():
        co = utils.execute_command(f'id mike')
        if co["success"] and 'mike' in co['output']:
            return True
        else:
            return False
    def stask8():
        co = utils.execute_command(f'ls /home')
        if co["success"] and 'mike' in co['output']:
            return True
        else:
            return False
    
    imap[3] = stask3()
    imap[4] = stask4()
    imap[7] = stask7()
    imap[8] = stask8()
    return imap

def task3():
    imap = {}
    hd = utils.gethomedir()
    taskd = 'Lab2Task3'
    def stask6():
        co = utils.execute_command(f'groups mike')
        if co["success"] and 'sudo' in co['output']:
            return True
        else:
            return False
    def stask8():
        f1 = f"{hd}/{taskd}/file1.txt"
        f2 = f"{hd}/{taskd}/file2.txt"
        f3 = f"{hd}/{taskd}/file3.txt"
        c = f"ls -l {f1} {f2} {f3} | awk '{{print $1}}'"
        co = utils.execute_command(c)
        if co["success"] and co['output'] == "-rwx------\n-r--------\n-r--r--r--":
            return True
        else:
            return False
    
    imap[6] = stask6()
    imap[8] = stask8()
    return imap