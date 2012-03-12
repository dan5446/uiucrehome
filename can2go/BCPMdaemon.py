#!/usr/bin/env python
'''
Created on 2011-08-02

@author: Dan Mestas 'mestas1'
@email: dan5446@gmail.com    
'''
import os
import time
from datetime import datetime
from dbconnect import dbconnect

controller_path = '/home/uiucsd/www/uiucrehome/can2go/'
shellScript = 'getDataLog.sh'
fileName = 'bcpm_1.csv'
corruptionError = False
lastTimestamp = ""
BCPMID = 904 
BCPMConnected = True
deviceIDs = [8003,0,2001,1003,2003,9001,2003,9002,2004,9003,2004,1002,2005,9006,2005,2006,9004,2007,9005,8001,9005,2002,8002,2008]
disconnectSent = False
connectSent = False
#see database device ids and BCPM setup Info /logging

def parseAll():
	print('Fetching Entire File')
	f = open(controller_path+fileName)
	DataString = f.readlines()
	ColumnTitles = DataString[6]
	ColumnTitles = ColumnTitles.strip().split(',')
	if ColumnTitles[0] != 'Error' and ColumnTitles[len(ColumnTitles)] != 'Dishwasher Real Energy (kWh)': #Changes in file will break this line
		corruptionError = True
		return
	ColumnRawData = []
	for index in range(7,len(DataString)):
		ColumnRawData.append(DataString[index].strip().split(','))
	targetLength = len(ColumnTitles)
	for array in ColumnRawData:
		if len(array) != targetLength:
			corruptionError = True
			print("Corrupt DataFile, Fetching Again")
			return
	timeStamps = []
	for array in ColumnRawData:
		timeStamps.append(array[1])
	db = dbconnect()
	db.unCorruptPowerLogs()
	dbLatest = db.fetchLastPowerReading() #Find the last timestamp in the database
	dbLatest = datetime.strptime(str(dbLatest), "%Y-%m-%d %H:%M:%S")
	timeArray = []
	deviceArray = []
	wattsArray = []
	kwhArray = []
	for i in range(1,len(ColumnRawData)):
		newer = datetime.strptime(ColumnRawData[i][2], "%Y-%m-%d %H:%M:%S")
		older = datetime.strptime(ColumnRawData[i-1][2], "%Y-%m-%d %H:%M:%S")
		delta = newer-older
		seconds = delta.seconds + (delta.days * 86400)
		kwhToWatts = (3600 * 1000) / seconds;
		for j in range(3,27):
			if j == 4: 
				continue
			kwh = float(ColumnRawData[i][j]) - float(ColumnRawData[i-1][j])
			watts = kwh * kwhToWatts
			if (watts < 0 or kwh < 0):
				watts = 0
				kwh  = 0
			timeArray.append(newer)
			deviceArray.append(deviceIDs[j-3])
			wattsArray.append(float(watts))
			kwhArray.append(float(kwh))
			print('kwh: '+str(kwh)+' seconds: '+str(seconds)+' watts: '+str(watts))
	
	for i in range(0,len(timeArray)):
		if(timeArray[i] > dbLatest):
			db.insertPowerReading(str(deviceArray[i]),str(timeArray[i]),str(wattsArray[i]),str(kwhArray[i]))
		else:
			print('failed case')
'''	for entry in toInsert:
		lastTimestamp = entry[2]
		print(lastTimestamp)
		for index in range(3,27): #depends on format of log
			if index == 4:
				continue
			print(str(deviceIDs[index-3]) + " (" +entry[index]+")")
			db.insertPowerReading(deviceIDs[index-3],"'"+lastTimestamp+"'",entry[index], kwhArray[kwhIndex])
			Index += 1 '''

while(True):
	try: 
		p = os.popen(controller_path+shellScript)
		retString = p.read()
		retString = retString.split('\n')
		if retString[0] == 'Not connected.':
			if not disconnectSent:
				db = dbconnect()
				db.disconnected(BCPMID)
				db.close()
				disconnectSent = True
			BCPMConnected = True
			print('BCPM not connected')

	except:
		print('DataBase Error')
	if BCPMConnected:
		if not connectSent:
			db = dbconnect()
			db.connected(BCPMID)
			db.close()
			connectSent = True

		disconnectSent = True
		parseAll()

		if not corruptionError:
			print('Sleeping for 5 minutes')
			time.sleep(5*60) #sleep for 5 minutes
	else: 
		print('BCPM is Disconnected, Trying again in a minute')
		time.sleep(60) #try to connect every minute, when back parse the entire file
