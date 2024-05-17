total_tasks = 2
test_tasks = {
    "task1": {"n": 8, "tests": 2, "tindexi": [3, 7]},
    "task2": {"n": 8, "tests": 4, "tindexi": [4, 5, 6, 7, 8]},
}
import os
from utils import utils
def task1():
    imap = {}
    hd = utils.gethomedir()
    def stask3():
        r = utils.directory_exists(f'{hd}/dirone')
        return r
    def stask7():
        r = (utils.directory_exists(f'{hd}/dirone')
        and utils.file_exists(f'{hd}/dirone/one.txt')
        and utils.directory_exists(f'{hd}/dirtwo')
        and utils.file_exists(f'{hd}/dirtwo/two.txt')
        and utils.directory_exists(f'{hd}/dirthree')
        and utils.file_exists(f'{hd}/dirthree/three.txt')
        )
        return r
    imap[3] = stask3()
    imap[7] = stask7()
    return imap

def task2():
    imap = {}
    hd = utils.gethomedir()
    taskd = 'Lab1Task2'
    def stask4():
        r = (utils.file_exists(f'{hd}/{taskd}/sols/task4.txt')
        and utils.compare_files(f'{hd}/{taskd}/sols/task4.txt', f'../solutions/{taskd}/sols/task4.txt')
        )
        return r
    def stask5():
        r = (utils.file_exists(f'{hd}/{taskd}/sols/task5.txt')
        and utils.compare_files(f'{hd}/{taskd}/sols/task5.txt', f'../solutions/{taskd}/sols/task5.txt')
        )
        return r
    def stask6():
        co = utils.execute_command('ls /home')
        sol = utils.read_file(f'{hd}/{taskd}/sols/task6.txt')
        if co["success"] and sol["success"]:
            return co["output"] == sol["output"].strip()
        else:
            return False
    def stask7():
        r = (utils.file_exists(f'{hd}/{taskd}/sols/task7.txt')
        and utils.compare_files(f'{hd}/{taskd}/sols/task7.txt', f'../solutions/{taskd}/sols/task7.txt')
        )
        return r
    def stask8():
        r = (utils.file_exists(f'{hd}/{taskd}/sols/task8.txt')
        and utils.compare_files(f'{hd}/{taskd}/sols/task8.txt', f'../solutions/{taskd}/sols/task8.txt')
        )
        return r
    imap[4] = stask4()
    imap[5] = stask5()
    imap[6] = stask6()
    imap[7] = stask7()
    imap[8] = stask8()
    return imap

def task3():
    return 'lab1task3'