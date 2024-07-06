from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
import time
from tests import *
from utils import utils, awsutils
import csv

# app = Flask(__name__)
app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

labdict = {
    'lab1': 'linuxtasks1',
    'lab2': 'linuxtasks2',
    'lab3': 'linuxtasks3',
    'lab4': 'awslab1',
    'lab5': 'dockerlab1'
}

@app.route('/check_task', methods=['POST'])
def check_task():
    data = request.get_json()
    lab_id = data.get('lab_id')
    task_id = data.get('task_id')
    print(lab_id, task_id)
    function_name = f"l{lab_id}task{task_id}"
    func = globals()[function_name]
    a = func()
    print(a)
    time.sleep(2)
    return jsonify({
        "lab_id": lab_id,
        "task_id": task_id,
        "results": a,
        "file_exists_in_directory": ''
    })

@app.route('/check_task_aws', methods=['POST'])
def check_task_aws():
    data = request.get_json()
    print(data)
    answers = data.get('qmap', {})
    lab_id = data.get('lab_id')
    task_id = data.get('task_id')
    creds = data.get('creds')
    user_id = creds['field1']
    function_name = f"l{lab_id}task{task_id}"
    func = globals()[function_name]
    row = awsutils.get_row_by_userid('data.csv', user_id)
    if row:
        print("Row found:", row)
    else:
        print("User ID not found.")
        return jsonify({'error': 'aws access error'}), 404
    a = func(row, answers)
    print(a)
    time.sleep(2)
    return jsonify({
        "lab_id": lab_id,
        "task_id": task_id,
        "results": a,
        "file_exists_in_directory": ''
    })

@app.route('/check_task_docker', methods=['POST'])
def check_task_docker():
    data = request.get_json()
    print(data)
    answers = data.get('qmap', {})
    lab_id = data.get('lab_id')
    task_id = data.get('task_id')
    stask_id = data.get('stask_id')
    function_name = f"l{lab_id}stask{stask_id}"
    func = globals()[function_name]
    a = func(answers)
    print(a)
    time.sleep(3)
    return jsonify({
        "lab_id": lab_id,
        "task_id": task_id,
        "stask_id": stask_id,
        "results": a
    })

@app.route('/data/<lab_id>')
def get_data(lab_id):
    d = labdict[f'lab{lab_id}']
    directory = f'../{d}'    
    files = os.listdir(directory)
    json_files = [file for file in files if file.endswith('.json')]
    jsonlist = []
    try:
        for json_file in json_files:
            file_path = os.path.join(directory, json_file)
            with open(file_path, 'r') as f:
                data = json.load(f)
                jsonlist.append(data)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    jsonlist = sorted(jsonlist, key=lambda x: x['taskid'])
    return jsonify(jsonlist)

@app.route('/data1', methods=['GET'])
def get_data1():
    lab_id = request.args.get('labid')
    task_id = request.args.get('taskid')
    utils.cleanstructure(f"Lab{lab_id}Task{task_id}")
    d = labdict[f'lab{lab_id}']
    directory = f'../labs/{d}'    
    files = os.listdir(directory)
    files = [f"task{task_id}.json"]
    json_files = [file for file in files if file.endswith('.json')]
    jsonlist = []
    print(json_files)
    try:
        for json_file in json_files:
            file_path = os.path.join(directory, json_file)
            with open(file_path, 'r') as f:
                data = json.load(f)
                jsonlist.append(data)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    jsonlist = sorted(jsonlist, key=lambda x: x['taskid'])
    return jsonify(jsonlist)

@app.route('/getdockerlab', methods=['GET'])
def getdockerlab():
    lab_id = request.args.get('labid')
    task_id = request.args.get('taskid')
    stask_id = request.args.get('staskid')
    # utils.cleanstructure(f"Lab{lab_id}Task{task_id}")
    d = labdict[f'lab{lab_id}']
    directory = f'../labs/{d}'    
    files = os.listdir(directory)
    files = [f"task{task_id}.json"]
    json_files = [file for file in files if file.endswith('.json')]
    jsonlist = []
    print(json_files)
    try:
        for json_file in json_files:
            file_path = os.path.join(directory, json_file)
            with open(file_path, 'r') as f:
                data = json.load(f)
                jsonlist.append(data)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    jsonlist = sorted(jsonlist, key=lambda x: x['taskid'])
    return jsonify(jsonlist)

@app.route('/creds', methods=['POST'])
def save_data():
    data = request.json
    userid = data['userid']
    access = data['access']
    secret = data['secret']
    try:
        with open('data.csv', 'x', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['userid', 'access', 'secret'])
    except FileExistsError:
        pass
    try:
        with open('data.csv', 'r', newline='') as file:
            reader = csv.reader(file)
            next(reader)
            for row in reader:
                print(row, userid, access, secret)
                if row[0] == userid and len(access)==0 and len(secret)==0:
                    return jsonify({'message': 'Data already exists'}), 400
                elif row == [userid, access, secret]:
                    return jsonify({'message': 'Data already exists'}), 400
    except Exception as e:
        print(e) 
    with open('data.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([userid, access, secret])
    return jsonify({'message': 'Data saved successfully'}), 200

@app.route('/connect', methods=['POST'])
def getinsid():
    data = request.json
    print('data --> ', data)
    userid = data['creds']['field1']
    ins_name = data['insname']
    row = awsutils.get_row_by_userid('data.csv', userid)
    id = None
    try:
        id = awsutils.get_ec2_instanceid_by_name(row, ins_name)
        print(id)
        if id == 'error':
            return jsonify({'id': None }), 200    
        return jsonify({'id': id }), 200
    except Exception as e:
        return jsonify({'id': id }), 200

# Serve React App
@app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
def serve(path):
    # if path != "" and path.exists(app.static_folder + '/' + path):
    #     return send_from_directory(app.static_folder, path)
    # else:
    #     return send_from_directory(app.static_folder, 'index.html')
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

# clone project
# ------------------------
# git clone https://github.com/sharathchandra04/dolabs.git
# cd dolabs/

# backend setup(terminal)
# -------------------------
# python3 -m venv venv
# source venv/bin/activate
# cd server/
# pip install -r requirements.txt 

# start server backend
# ------------------------
# python server.py 

# setup frontend(new terminal)
# ------------------------
# cd client
# nvm use 20
# npm install

# start frontend
# ------------------------
# npm start 
