
'''
Created on 2011-06-02

@author: Dan Mestas 'mestas1'
@email: dan5446@gmail.com
'''
import shlex, math, MySQLdb, time
from subprocess import Popen, PIPE
from rehome_defs import controller_path, state_var_check_args

class dbconnect(object):
    
    def __init__(self):
        tries = 0
        while(tries < 5):
            try:
                self.db = MySQLdb.connect(host='localhost', user='uiucsd', passwd='uiuc$d2011', db='uiucsd')
                tries = 5
            except MySQLdb.OperationalError:
                tries += 1
                time.sleep(5)
        self.cur = self.db.cursor()
    
    def insert_gallon(self,id):
        self.cur.execute('''INSERT INTO `uiucsd`.`water_logs` (`device_id`, `timestamp`) VALUES ('''+ str(id) + ''', CURRENT_TIMESTAMP);''')

    def door_open(self,id):
        self.cur.execute('''UPDATE `door_states` SET state = 0, timestamp = CURRENT_TIMESTAMP WHERE device_id = '''+ str(id))

    def door_close(self,id):
        self.cur.execute('''UPDATE `door_states` SET state = 1, timestamp = CURRENT_TIMESTAMP WHERE device_id = '''+ str(id))
    
    def disconnected(self, id):
	self.cur.execute('''UPDATE `controller_state` SET value = 0, timestamp = CURRENT_TIMESTAMP WHERE device_id = '''+ str(id))

    def connected(self, id):
	self.cur.execute('''UPDATE `controller_state` SET value = 1, timestamp = CURRENT_TIMESTAMP WHERE device_id = '''+ str(id))
   
    def unCorruptPowerLogs(self):
	self.cur.execute('''DELETE FROM `power_logs` WHERE timestamp > CURRENT_TIMESTAMP''')

    def fetchLastPowerReading(self):
	self.cur.execute('''SELECT max(timestamp) FROM `power_logs` WHERE 1''')
	resultTuple = self.cur.fetchone()
	if resultTuple[0]:
		return resultTuple[0] #If power_logs not empty
	else:
		return '1800-01-01 00:00:00'

    def insertPowerReading(self, id, timestamp, value, kwh):
	self.cur.execute("INSERT INTO  `uiucsd`.`power_logs` (`device_id` ,`timestamp` ,`value`, `kwh`) VALUES ('"+str(id)+"', '"+timestamp+"', '"+value+"', '"+str(kwh)+"')")

    def close(self):
	self.db.close()
