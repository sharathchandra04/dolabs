import subprocess
import os
import shutil

def directory_exists_check(path):
    try:
        if os.path.exists(path) and os.path.isdir(path):
            return {"success": True, "output": True}
        else:    
            return {"success": True, "output": False}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"success": False, "output": None}

def directory_exists(path):
    r = directory_exists_check(path)
    if r["success"]: return r["output"] 
    else: return False
    
def file_exists_check(file_path):
    try:
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return {"success": True, "output": True}
        else:    
            return {"success": True, "output": False}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"success": False, "output": None}

def file_exists(file_path):
    r = file_exists_check(file_path)
    if r["success"]: return r["output"] 
    else: return False
        
def gethomedir():
    home_directory = os.path.expanduser("~")
    return home_directory

def compare_files(file1_path, file2_path):
    try:
        with open(file1_path, 'r') as file1, open(file2_path, 'r') as file2:
            content1 = file1.read()
            content2 = file2.read()
            if content1 == content2:
                return {"success": True, "output": True}
            else:
                return {"success": True, "output": False}
    except FileNotFoundError:
        print("One or both files not found")
        return {"success": False, "output": None}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"success": False, "output": None}

def execute_command(command):
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            return {"success": True, "output": result.stdout.strip()}
        else:
            print(f"Command failed with return code {result.returncode}")
            return {"success": False, "output": None}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"success": False, "output": None}

def read_file(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            return {"success": True, "output": content}
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return {"success": False, "output": None}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"success": False, "output": None}
def cleanstructure(copydir):
    def remove_directories_from_home(directories):
        home_directory = os.path.expanduser("~")
        for directory in directories:
            directory_path = os.path.join(home_directory, directory)
            if os.path.exists(directory_path) and os.path.isdir(directory_path):
                shutil.rmtree(directory_path)
                print(f"Directory '{directory}' removed from home directory")
            else:
                print(f"Directory '{directory}' not found in home directory")
    def copy_structure_to_home(directory_name):
        home_directory = os.path.expanduser("~")
        current_directory = os.getcwd()
        print("Current working directory:", current_directory)
        source_directory = os.path.join(current_directory, '../labs/structure', directory_name)
        print('source_directory --> ', source_directory)
        destination_directory = os.path.join(home_directory, directory_name)
        if os.path.exists(source_directory) and os.path.isdir(source_directory):
            shutil.copytree(source_directory, destination_directory)
            print(f"Directory '{directory_name}' copied to home directory")
        else:
            print(f"Directory '{directory_name}' not found inside 'structure' directory")

    directories_to_remove = ['dirone', 'dirtwo', 'dirthree', 
                             'Lab1Task1', 'Lab1Task2',              # linuxlabs
                             'Lab2Task1', 'Lab2Task2', 'Lab2Task3', # linuxlabs
                             'Lab3Task1', 'Lab3Task2'               # linuxlabs
                            ]
    remove_directories_from_home(directories_to_remove)
    directory_to_copy = copydir
    copy_structure_to_home(directory_to_copy)

def filter_dicts(dict_list, filter_by):
    return [d for d in dict_list if all(d.get(k) == v for k, v in filter_by.items())]

