'''
Created on 2011-08-02

@author: Dan Mestas 'mestas1'
@email: dan5446@gmail.com    
'''
import struct

fmt = '5B'

tempZ1  = struct.pack(fmt, 0x01, 0x00, 0x00, 0x00, 0x00)
tempZ2  = struct.pack(fmt, 0x01, 0x01, 0x00, 0x00, 0x00)
humZ1   = struct.pack(fmt, 0x01, 0x02, 0x00, 0x00, 0x00)
humZ2   = struct.pack(fmt, 0x01, 0x03, 0x00, 0x00, 0x00)
co2Z1   = struct.pack(fmt, 0x01, 0x04, 0x00, 0x00, 0x00)
co2Z2   = struct.pack(fmt, 0x01, 0x05, 0x00, 0x00, 0x00)
tempOS  = struct.pack(fmt, 0x01, 0x06, 0x00, 0x00, 0x00)
humOS   = struct.pack(fmt, 0x01, 0x07, 0x00, 0x00, 0x00)
tempHW  = struct.pack(fmt, 0x01, 0x08, 0x00, 0x00, 0x00)

freq1   = struct.pack(fmt, 0x03, 0x00, 0x00, 0x00, 0x00)
freq2   = struct.pack(fmt, 0x03, 0x01, 0x00, 0x00, 0x00)
vrMode  = struct.pack(fmt, 0x03, 0x02, 0x00, 0x00, 0x00)
chMode  = struct.pack(fmt, 0x03, 0x03, 0x00, 0x00, 0x00)
blowrs  = struct.pack(fmt, 0x03, 0x04, 0x00, 0x00, 0x00)
fromIn  = struct.pack(fmt, 0x03, 0x05, 0x00, 0x00, 0x00)
toIn    = struct.pack(fmt, 0x03, 0x06, 0x00, 0x00, 0x00)
fromOut = struct.pack(fmt, 0x03, 0x07, 0x00, 0x00, 0x00)
toOut   = struct.pack(fmt, 0x03, 0x08, 0x00, 0x00, 0x00)
getKP   = struct.pack(fmt, 0x05, 0x00, 0x00, 0x00, 0x00)
getKI   = struct.pack(fmt, 0x05, 0x01, 0x00, 0x00, 0x00)
getKD   = struct.pack(fmt, 0x05, 0x02, 0x00, 0x00, 0x00)
mode    = struct.pack(fmt, 0x05, 0x03, 0x00, 0x00, 0x00)

testCmd = struct.pack(fmt, 0x00, 0x01, 0x00, 0x00, 0x00)

cmdArray = [ tempZ1, tempZ2, humZ1, humZ2, co2Z1, co2Z2, 
	     tempOS, humOS, tempHW, freq1, freq2, vrMode, chMode, 
	     blowrs, fromIn, toIn, fromOut, toOut, getKP, getKI, 
	     getKD, mode ] 

statusCodes = [ 'z1t', 'z2t', 'z1h', 'z2h', 'cd1', 'cd2', 'ost', 'osh', 'hwt', 'fq1', 'fq2', 'vrm', 'chm', 'blr', 'tfi', 'tti', 'tfo', 'tto', 'pkp', 'pki', 'pkd', 'mod' ]

retFmt  = '2B'
responseLen = 2
success = struct.pack(retFmt, 0xff, 0xfe)
fail    = struct.pack(retFmt, 0xff, 0xff)
active  = struct.pack(retFmt, 0xfe, 0xef)

CERVid = '903'
serialPath = '/dev/ttyACM'

setFreq1	= 2
setFreq2	= 3
setVR		= 4
setCH		= 5
setBl1		= 6
setBl2		= 7
setPID		= 8
autoManual	= 9
sampleTime 	= 10
setPreset	= 11
setPoint	= 12
CERVoff		= 13

