import boto3
import csv

def get_row_by_userid(csv_file, userid):
    with open(csv_file, 'r', newline='') as file:
        reader = csv.reader(file)
        for row in reader:
            if row[0] == userid:
                return row
    return None

def check_instances_presence(creds, instance_names):
    try:
        ec2 = boto3.client(
            'ec2',
            aws_access_key_id=creds[1],
            aws_secret_access_key=creds[2],
            region_name='us-east-1'
        )
        response = ec2.describe_instances()
        inames = []
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                name = None
                for tag in instance['Tags']:
                    if tag['Key'] == 'Name':
                        name = tag['Value']
                        inames.append(name) 
                        break
        r = True
        for instance_name in instance_names:
            if instance_name not in inames: r = False
        return r
    except Exception:
        return 'error'    

def get_security_group_inbound_rules(creds, group_name, irl):
    # checks name and inbound rules
    try:
        ec2 = boto3.client(
            'ec2',
            aws_access_key_id=creds[1],
            aws_secret_access_key=creds[2],
            region_name='us-east-1'
        )
        response = ec2.describe_security_groups(GroupNames=[group_name])
        if not response['SecurityGroups']:
            print(f"Security group with name '{group_name}' does not exist.")
            return 'error'
        security_group = response['SecurityGroups'][0]
        inbound_rules = []
        for rule in security_group['IpPermissions']:
            if 'FromPort' in rule and 'IpProtocol' in rule and 'IpRanges' in rule:
                rs = ''
                rs = rs + str(rule['FromPort']) + "_" + rule['IpProtocol'] + '_'
                for ip_range in rule['IpRanges']:
                    rs = rs + ip_range['CidrIp'] + '_'
                inbound_rules.append(rs)
        print(inbound_rules)
        r = True
        for i in irl:
            if i not in inbound_rules: r = r and False
        return r
    except Exception as e:
        print(e)
        return 'error'

def get_ec2_instance_by_name(creds, instance_name):
    try:
        ec2 = boto3.client(
            'ec2',
            aws_access_key_id=creds[1],
            aws_secret_access_key=creds[2],
            region_name='us-east-1'
        )
        response = ec2.describe_instances(Filters=[
            {
                'Name': 'tag:Name',
                'Values': [instance_name]
            }
        ])
        reservations = response.get('Reservations', [])
        if not reservations:
            print(f"No instance with name '{instance_name}' found.")
            return 'error'
        instance = reservations[0]['Instances'][0]
        return instance
    except Exception as e:
        print(e)
        return 'error'

def get_ec2_instanceid_by_name(creds, instance_name):
    try:
        ins = get_ec2_instance_by_name(creds, instance_name)
        if ins == 'error':
            return 'error'
        return ins['InstanceId']
    except Exception as e:
        print(e)
        return 'error'

def check_security_ec2_link(creds, instance_name, sg):
    instance = get_ec2_instance_by_name(creds, instance_name)
    if instance == 'error':
        return 'error'
    security_group_names = []
    for group in instance['SecurityGroups']:
        security_group_names.append(group['GroupName'])
    for i in sg:
        if i not in security_group_names:
            return False
    return True

def get_amis(creds):
    try:
        ec2 = boto3.client(
            'ec2',
            aws_access_key_id=creds[1],
            aws_secret_access_key=creds[2],
            region_name='us-east-1'
        )
        response = ec2.describe_images(Owners=['self'])
        amis = response['Images']
        return amis
    except Exception as e:
        print(e)
        return 'error'

# def get_snapshots(creds):
#     try:
#         ec2 = boto3.client(
#             'ec2',
#             aws_access_key_id=creds[1],
#             aws_secret_access_key=creds[2],
#             region_name='us-east-1'
#         )
#         response = ec2.describe_snapshots(OwnerIds=['self'])
#         snapshots = response['Snapshots']
#         return snapshots
#     except Exception as e:
#         print(e)
#         return 'error'

def get_snapshots(creds):
    try:
        ec2 = boto3.client(
            'ec2',
            aws_access_key_id=creds[1],
            aws_secret_access_key=creds[2],
            region_name='us-east-1'
        )
        response = ec2.describe_snapshots(OwnerIds=['self'])
        snapshots = response['Snapshots']
        return snapshots
    except Exception as e:
        print(e)
        return 'error'


def get_elastic_ips(creds):
    try:
        ec2 = boto3.client(
            'ec2',
            aws_access_key_id=creds[1],
            aws_secret_access_key=creds[2],
            region_name='us-east-1'
        )
        response = ec2.describe_addresses()
        elastic_ips = response['Addresses']
        return elastic_ips
    except Exception as e:
        print(e)
        return 'error'

def get_instance_volumes(creds, insid):
    try:
        ec2 = boto3.client(
            'ec2',
            aws_access_key_id=creds[1],
            aws_secret_access_key=creds[2],
            region_name='us-east-1'
        )
        response = ec2.describe_volumes(Filters=[{'Name': 'attachment.instance-id', 'Values': [insid]}])
        volumes = response.get('Volumes', [])
        return volumes
    except Exception as e:
        print(e)
        return 'error'

