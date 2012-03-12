#!/usr/bin/env python
'''
Created on 2011-08-02

@author: Dan Mestas 'mestas1'
@email: dan5446@gmail.com   
Nearly same as the daemon, but updates only the status table 
'''
import MySQLdb, time, serial, sys, struct
from CERVdefs import *

returnMessage = ''

def findSerial(): # Try to connect to the appropriate serial ports and look for the correct reply
	i = 0
	connected = False
	while(connected == False):
		try:
			ser = serial.Serial(serialPath+str(i), 9600, timeout=1)
			ser.flush()
			time.sleep(2)
			ser.write(testCmd)
			returned = ser.read(responseLen)
			if(returned == success):
				ser.write(testCmd)
				connected = True
			elif(returned == fail):
				connected = True
			if(i > 3):
				print('Fail Not Connected')
				sys.exit(0)
			i += 1
		except:
			if(i > 3):
				print('Fail Not Connected')
				sys.exit(0) 
			i += 1
	return ser

def tryCommand(cereal, message):
	confirmed = False
	tries = 0
	while(confirmed == False and tries < 3):
		cereal.flush()
		cereal.write(message)
		try:
			newData = cereal.read(responseLen)
			if(newData == success):
				confirmed = True
			else:
				tries += 1
		except: 
			tries += 1
	if confirmed:
		return 'Success'
	else:
		return 'Fail'


def cleanup(cereal, returnMessage):
	cereal.close()
	print(returnMessage)
	sys.exit(0)

def fetchCommand(cereal):
	# This script takes 2 commandline arguments, a command number and a data value
	if (len(sys.argv) != 3):
		cleanup(cereal, 'Improper Argument Format')
	command = int(sys.argv[1])
	if( command < 2 or command > 9 ):
		cleanup(cereal, 'Improper Command Type')
	data = int(sys.argv[2])
	
	format = '5B'
	# Turn the data value into bytes
	b3 = data & 0x000000FF
	b4 = data >> 8 & 0x000000FF
	b4 = data >> 16 & 0x000000FF

	if( command == setFreq1 ):
		b1 = 0x02
		b2 = 0x00
		
	elif( command == setFreq2 ):
		b1 = 0x02
		b2 = 0x01
		
	elif( command == setVR ):
		b1 = 0x02
		b2 = 0x02
		
	elif( command == setCH ):
		b1 = 0x02
		b2 = 0x03
		
	elif( command == setBl1 ):
		b1 = 0x02
		b2 = 0x04
		
	elif( command == setBl2 ):
		b1 = 0x02
		b2 = 0x04
		
	elif( command == setPID ):
		b1 = 0x04
		b2 = 0x01
		
	elif( command == autoManual ):
		b1 = 0x04
		b2 = 0x00

	elif( command == sampleTime ):
		b1 = 0x04
		b2 = 0x02

	elif( command == setPreset ):
		b1 = 0x04
		b2 = 0x03

	elif ( command == setPoint ):
		b1 = 0x00
		b2 = 0x02

	elif ( command == CERVoff ):
		if data == 0:
			b1 = 0x02
			b2 = 0x00
			message = struct.pack(format, b1, b2, 0x00, 0x00, 0x00)
			tryCommand(cereal, message) #set to Manual Mode
			b1 = 0x02
			b2 = 0x01
			message = struct.pack(format, b1, b2, 0x00, 0x00, 0x00)
			tryCommand(cereal, message) #set Freq1 to 0
			b1 = 0x02
			b2 = 0x02
			b3 = 0x00
			b4 = 0x00
			b5 = 0x00 #set Freq2 to 0
		else:
			b1 = 0x02
			b2 = 0x00
			b3 = 0x00
			b4 = 0x00
			b5 = 0x01 #set Auto Mode

	message = struct.pack(format, b1, b2, b3, b4, b5)
	print(b1 ,b1, b2, b3, b4, b5)
	print(struct.unpack(format, message))
	return message
		

cereal = findSerial()
message = fetchCommand(cereal)
returnMessage = tryCommand(cereal, message)
cleanup(cereal, returnMessage)  


