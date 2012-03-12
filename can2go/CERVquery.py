#!/usr/bin/env python
'''
Created on 2011-08-02

@author: Dan Mestas 'mestas1'
@email: dan5446@gmail.com    
'''
import MySQLdb, time, serial
from CERVdefs import *

lastData = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]


class CERV(object): #type 0 -> daemon query type 1 -> status query
	def __init__(self,type=1):
		self.type = type
		tries = 0
		while(tries < 5):
		    try:
			self.db = MySQLdb.connect(host='localhost', user='uiucsd', passwd='uiuc$d2011', db='uiucsd')
			tries = 10
		    except MySQLdb.OperationalError:
			tries += 1
			time.sleep(5)
		if tries != 10:
			print('Error Connecting To Database')
			return
		else: 
			print('Database Connected');
		self.cur = self.db.cursor()
		self.cereal = self.findSerial()
		if(self.cereal):
			self.queryState()
			self.update_database_state() 
			self.cleanup()  
		else:
			print('Closing Database')
			self.db.close()
			return

	def findSerial(self): # Try to connect to the appropriate serial ports and look for the correct reply
		i = 0
		connected = False
		while(connected == False):
			try:
				ser = serial.Serial(serialPath+str(i), 9600, timeout=1)
				ser.read(12)
				ser.write(testCmd)
				returned = ser.read(responseLen)
				if(returned == active):
					#self.cereal.flushInput()
					connected = True
				elif(returned == fail):
					connected = False
				else: 
					print('bad return on port '+str(i)+str(returned))
					#connected = True # take this out after!!!
				if(i > 3):
					self.cur.execute('SELECT `value` FROM `uiucsd`.`controller_state` WHERE `controller_state`.`device_id` = ' + CERVid)
					resultTuple = self.cur.fetchone()
					if(resultTuple[0] == 1):
						self.cur.execute("UPDATE  `uiucsd`.`controller_state` SET  `value` = 0, `timestamp` = CURRENT_TIMESTAMP WHERE `controller_state`.`device_id` = " + CERVid)
					return 0
				i += 1
			except:
				print('Port ' + str(i) + ' does not exist')
				if(i > 3):
					self.cur.execute('SELECT `value` FROM `uiucsd`.`controller_state` WHERE `controller_state`.`device_id` = ' + CERVid)
					resultTuple = self.cur.fetchone()
					if(resultTuple[0] == 1):
						self.cur.execute("UPDATE  `uiucsd`.`controller_state` SET  `value` = 0, `timestamp` = CURRENT_TIMESTAMP WHERE `controller_state`.`device_id` = " + CERVid)
					return 0
				i += 1
		return ser

    	def queryState(self):
		self.cereal.read(6)
		for i in range(len(cmdArray)):
			try:
				self.cereal.flush()
				self.cereal.write(cmdArray[i])
			except:
				self.cleanup()
			try:
				newData = self.cereal.read(responseLen)
				lastData[i] = int(newData.encode('hex'), 16)
				print(statusCodes[i] + ' = ' + str(lastData[i])) # to come out
			except: 
				self.cleanup()

	def update_database_state(self):
		print('Im updating the Database')
		self.cur.execute("UPDATE `controller_state` SET  `value` = 1, `timestamp` = CURRENT_TIMESTAMP WHERE `controller_state`.`device_id` = " + CERVid)
		# Add a log Entry For The Temps, etc
		if self.type == 0:
			self.cur.execute('INSERT INTO `uiucsd`.`temperature_logs` (`device_id`, `temp`, `humidity`, `co2`, `created_at`) VALUES (2, ' + str(float(lastData[0]) / 10) + ', ' + str(float(lastData[2]) / 10) + ', ' + str(lastData[4]) + ', CURRENT_TIMESTAMP);')
			self.cur.execute('INSERT INTO `uiucsd`.`temperature_logs` (`device_id`, `co2`, `humidity`, `temp`, `created_at`) VALUES (3, ' + str(float(lastData[1]) / 10) + ', ' + str(float(lastData[3]) / 10) + ', ' + str(lastData[5]) + ', CURRENT_TIMESTAMP);')
			self.cur.execute('INSERT INTO `uiucsd`.`temperature_logs` (`device_id`, `temp`, `humidity`, `created_at`) VALUES (4, ' + str(float(lastData[6]) / 10) + ', ' + str(float(lastData[7]) / 10) + ', CURRENT_TIMESTAMP);')	
		# Update The CERV status Table
		for i in range(len(statusCodes)):
			if( (i < 4) or (i == 6) or (i == 8) or (i == 7) ):
				print('dividing by ten')
				self.cur.execute("UPDATE  `uiucsd`.`cerv_status` SET  `value` = '" + str(float(lastData[i]) /10) + "', `timestamp` = CURRENT_TIMESTAMP WHERE  `cerv_status`.`code` = '" + statusCodes[i] + "';")
			elif( (i > 17) and (i < 21) ):
				self.cur.execute("UPDATE  `uiucsd`.`cerv_status` SET  `value` = '" + str(float(lastData[i] / 100)) + "', `timestamp` = CURRENT_TIMESTAMP WHERE  `cerv_status`.`code` = '" + statusCodes[i] + "';")
			else:
				self.cur.execute("UPDATE  `uiucsd`.`cerv_status` SET  `value` = '" + str(lastData[i]) + "', `timestamp` = CURRENT_TIMESTAMP WHERE  `cerv_status`.`code` = '" + statusCodes[i] + "';")
		print('Ive updated the Database')

	def cleanup(self):
		print('Closing Database in Cleanup')
		self.cereal.close()
		self.db.close()

