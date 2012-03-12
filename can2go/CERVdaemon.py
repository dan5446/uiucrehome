#!/usr/bin/env python
'''
Created on 2011-08-02

@author: Dan Mestas 'mestas1'
@email: dan5446@gmail.com    
'''
import MySQLdb, time, serial, CERVquery
from CERVdefs import *
from CERVquery import CERV

while(True):
	try: 
		print('trying cerv')
		myCERV = CERV(type = 0)
	except:
		time.sleep(5)
		print('error')
	time.sleep(10)
	# Do some Aggregation on the Database Here
