from utils import utils, awsutils
def task1(creds, answers):
    imap = {}
    def stask1():
        group_name = 'sgl4'
        irl = ['22_tcp_0.0.0.0/0_']
        presence = awsutils.get_security_group_inbound_rules(creds, group_name, irl)
        if presence == 'error':
            return False
        return presence
    def stask2():
        instance_names_to_check = ['ec2l4-1']
        presence = awsutils.check_instances_presence(creds, instance_names_to_check)
        if presence == 'error':
            return False
        return presence
    def stask3():
        r = awsutils.check_security_ec2_link(creds, 'ec2l4-1', ['sgl4'])
        if r == 'error':
            return False
        return r
    def stask4():
        instance_names_to_check = ['ec2l4-2']
        presence = awsutils.check_instances_presence(creds, instance_names_to_check)
        if presence == 'error':
            return False
        return presence
    def stask5():
        instance = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-2')
        if instance == 'error':
            return False
        if instance['State']['Name'] == 'terminated':
            return True
        return False    
    def stask7():
        group_name = 'sgl4'
        irl = ['22_tcp_0.0.0.0/0_', '3000_tcp_0.0.0.0/0_']
        presence = awsutils.get_security_group_inbound_rules(creds, group_name, irl)
        if presence == 'error':
            return False
        return presence    
    
    imap[1] = stask1()
    imap[2] = stask2()
    imap[3] = stask3()
    imap[4] = stask4()
    imap[5] = stask5()
    imap[7] = stask7()
    return imap

def task2(creds, answers):
    print('answers --> ', answers)
    imap = {}
    ec2l43ins = None
    ec2l44ins = None
    ec2l45ins = None
    def stask1():
        group_name = 'sgl4-2'
        irl = ['22_tcp_0.0.0.0/0_']
        presence = awsutils.get_security_group_inbound_rules(creds, group_name, irl)
        if presence == 'error':
            return False
        return presence
    def stask2():
        instance_names_to_check = ['ec2l4-3']
        presence = awsutils.check_instances_presence(creds, instance_names_to_check)
        if presence == 'error':
            return False
        return presence
    def stask3():
        ans4241 = answers.get('4241', '#')
        ans4242 = answers.get('4242', '#')
        ans4243 = answers.get('4243', '#')
        nonlocal ec2l43ins
        ec2l43ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-3')
        if ec2l43ins == 'error' or ec2l43ins == None: return False
        # security_group_ids = [print(sg) for sg in ec2l43ins.get('SecurityGroups', [])]
        security_group_ids = [sg['GroupName'] for sg in ec2l43ins.get('SecurityGroups', [])]
        if 'sgl4-2' in security_group_ids: return True
        return False
    def stask4():
        ans4241 = answers.get('4241', '#')
        ans4242 = answers.get('4242', '#')
        ans4243 = answers.get('4243', '#')
        # ec2l43ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-3')
        print('4. ec2l43ins ---> ', ec2l43ins)
        if ec2l43ins == 'error' or ec2l43ins == None: return False
        public_ip = ec2l43ins.get('PublicIpAddress', None)
        private_ip = ec2l43ins.get('PrivateIpAddress', None)
        dns_name = ec2l43ins.get('PublicDnsName', None)
        if str(ans4241).strip() == public_ip and str(ans4242).strip() == private_ip and str(ans4243).strip() == dns_name:
            return True
        return False
    def stask5():
        if ec2l43ins == None or ec2l43ins == 'error':
            return False
        ans4251 = answers.get('4251', '#')
        volume_ids= []
        for volume in ec2l43ins.get('BlockDeviceMappings', []):
            volume_ids.append(volume.get('Ebs', {}).get('VolumeId'))
            a = volume.get('Ebs', {})
            b = a.get('VolumeId')
            print(b)
        print('volume_ids --> ', volume_ids)
        if str(ans4251).strip() in volume_ids:return True
        return False
    # def stask6():
    #     return True
    def stask7():
        ans4271 = answers.get('4241', '#')
        ec2l43ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-3')
        if ec2l43ins == 'error' or ec2l43ins == None: return False
        volume_ids= []
        for volume in ec2l43ins.get('BlockDeviceMappings', []): volume_ids.append(volume.get('Ebs', {}).get('VolumeId'))
        if str(ans4271).strip() in volume_ids:return True
        return False
    def stask8():
        ans4281 = answers.get('4281', '#')
        ans4282 = answers.get('4282', '#')
        snapshots = awsutils.get_snapshots(creds)
        if snapshots == 'error' or snapshots==None:return False
        amis = awsutils.get_amis(creds)
        if amis == 'error' or amis==None:return False
        ami_ids = [ ami['ImageId'] for ami in amis]
        snapshot_ids = [ snp['SnapshotId'] for snp in snapshots]
        if str(ans4281).strip() in ami_ids and str(ans4282).strip() in snapshot_ids: return True
        return False
    def stask9():
        ans4291 = answers.get('4291', '#')
        ans4292 = answers.get('4292', '#')
        eips = awsutils.get_elastic_ips(creds)
        if eips == 'error' or eips==None:return False
        eips_strs = []
        for elastic_ip in eips:
            eips_strs.append(f"{elastic_ip.get('PublicIp', 'N/A')}_{elastic_ip.get('AllocationId', 'N/A')}")
        if f"{str(ans4291).strip()}_{str(ans4292).strip()}" in eips_strs: return True
        return False
    def stask11():
        ans4291 = answers.get('4291', '#')
        ec2l43ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-3')
        if ec2l43ins == 'error' or ec2l43ins == None: return False
        public_ip = ec2l43ins.get('PublicIpAddress', None)
        if str(ans4291).strip() == public_ip: return True
        return False
    def stask12():
        ans42123 = answers.get('42123', '#')
        ans42124 = answers.get('42124', '#')
        ans4281 = answers.get('4281', '#')
        ec2l44ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-4')
        if ec2l44ins == 'error' or ec2l44ins == None: return False
        amiid     = ec2l44ins.get('ImageId', None)
        insid     = ec2l44ins.get('InstanceId', None)
        insvolumes = awsutils.get_instance_volumes(creds, insid)
        if insvolumes == 'error': return False
        vslist = []
        for v in insvolumes:
            vid = v.get('VolumeId', None)
            sid = v.get('SnapshotId', None)
            vslist.append(f"{vid}_{sid}")
        if  f"{str(ans42123).strip()}_{str(ans42124).strip()}" in vslist and  str(ans4281).strip() == amiid:
            return True
        return False
    def stask13():
        ec2l45ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-5')
        if ec2l45ins == 'error' or ec2l45ins == None: return False
        return True
    def stask14():
        ec2l45ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-5')
        if ec2l45ins == 'error' or ec2l45ins == None: return False
        return True
    def stask15():
        ans42151 = answers.get('42151', '#')
        snapshots = awsutils.get_snapshots(creds)
        if snapshots == 'error' or snapshots==None:return False
        snapshot_ids = [ snp['SnapshotId'] for snp in snapshots]
        if str(ans42151).strip() in snapshot_ids: return True
        return False
    
    def stask16():
        name = 'snapshotami'
        amis = awsutils.get_amis(creds)
        if amis == 'error' or amis==None:return False
        ami_names = [ ami['Name'] for ami in amis]
        if str(name).strip() in ami_names: return True
        return False
    # def stask17():
    #     ec2l46ins = awsutils.get_ec2_instance_by_name(creds, 'ec2l4-6')
    #     if ec2l46ins == 'error' or ec2l46ins == None: return False
    #     amiid     = ec2l44ins.get('ImageId', None)
        
        return True
        # name = 'snapshotami'
        # amis = awsutils.get_amis(creds)
        # if amis == 'error' or amis==None:return False
        # ami_names = [ ami['Name'] for ami in amis]
        # if str(name).strip() in ami_names: return True
        # return False
        
    imap[1] = stask1()
    imap[2] = stask2()
    imap[3] = stask3()
    imap[4] = stask4()
    imap[5] = stask5()
    imap[7] = stask7()
    imap[8] = stask8()
    imap[9] = stask9()
    imap[11] = stask11()
    imap[12] = stask12()
    imap[13] = stask13()
    imap[14] = stask14()
    imap[15] = stask15()
    imap[16] = stask16()
    # imap[17] = stask17()
    return imap

def task3(creds, answers):
    return {}