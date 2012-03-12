#!/usr/bin/env python
'''
Created on 2011-06-02

@author: Dan Mestas 'mestas1'
@email: dan5446@gmail.com
'''
import shlex, math, MySQLdb, time, os
from subprocess import Popen, PIPE
from rehome_defs import controller_path, state_var_check_args


class daemonLoop(object):
    
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
        self.state_variable = 0
        self.changed = False
        self.reset_db_states()
        self.stateArray = self.query_relay_state()
        self.update_database_state(self.stateArray) 
        self.loop()  
    
    def reset_db_states(self):
    #connect to database clear all states
        self.cur.execute('''UPDATE relay_states SET state = 0 WHERE state = 1''')

    def query_relay_state(self):
    # connect to bacnet read av1 and translate return an array 
        p = Popen(args=shlex.split(controller_path + state_var_check_args), stdout=PIPE)
        from_string = p.communicate()[0]
        # Handle Error with APDU Timeout
        try:
            map = float(from_string)
	    self.cur.execute('SELECT `value` FROM `uiucsd`.`controller_state` WHERE `controller_state`.`device_id` = 901')
	    resultTuple = self.cur.fetchone()
	    if(resultTuple[0] == 0):
		self.cur.execute("UPDATE  `uiucsd`.`controller_state` SET  `value` = 1, `timestamp` = CURRENT_TIMESTAMP WHERE `controller_state`.`device_id` = 901")
        except ValueError:
            print("Error Fetching Lighting State")
	    self.cur.execute('SELECT `value` FROM `uiucsd`.`controller_state` WHERE `controller_state`.`device_id` = 901')
	    resultTuple = self.cur.fetchone()
	    if(resultTuple[0] == 1):
		self.cur.execute("UPDATE  `uiucsd`.`controller_state` SET  `value` = 0, `timestamp` = CURRENT_TIMESTAMP WHERE `controller_state`.`device_id` = 901")
            return self.state_variable
        
        map = int(math.floor(map))
        #print(map)
        state_array = [0,0,0,0,0,0,0,0,0,0,0,0]
        if map != self.state_variable:
            print("Updating Lighting States, AV1: " + str(map))
            self.changed = True
            self.state_variable = map
            for bit in range(12):
                state_array[bit] = (map >> bit) & 1
                #print(state_array[bit])
        return state_array
        
    def update_database_state(self, stateArray):
        if self.changed == True:
            self.changed = False
            self.reset_db_states()
            for relay in range(12):
                if self.stateArray[relay] == 1:
                    relay_num = str(relay + 1)
                    self.cur.execute('''UPDATE relay_states SET state = 1 WHERE Device_ID ='''+ relay_num)
                                       
    def loop(self):
        # handle input maybe
        while True:
            self.stateArray = self.query_relay_state()
            self.update_database_state(self.stateArray)
            time.sleep(2)

daemon = daemonLoop()
