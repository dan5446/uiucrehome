<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

if ( !isset($_POST['arguments']) || empty($_POST['arguments']) ) { 
	echo "No arguments Sent\n";
 }

	$aArgs = json_decode(stripslashes($_POST['arguments']), true);
	$units = array ( 
		'year' 	=> 29030400,
		'month' => 2419200,
		'week' 	=> 604800,
		'day'	=> 86400,
		'hour'	=> 3600,
		'minute'=> 60,
		'second'=> 1 
	);

	$iCurrentTimekey = time();
	$start = $iCurrentTimekey;
	$period = 0;//date("Y-m-d H:i:s", $iCurrentTimekey);
	$aGUIStatus = array('data'=>array(), 'start'=>$start);
	$query = '';
	$pointsWanted = 0;
	$query = '';

	switch ($aArgs['period']){
	    case 1:
		$start = $iCurrentTimekey - ($units['hour']); 
		$period = date("Y-m-d H:i:s", $start);
		$pointsWanted = 12;
	    break;
	    case 2:
		$start = $iCurrentTimekey - ($units['hour']*4);
		$period = date("Y-m-d H:i:s", $start);
		$pointsWanted = 12*4;
	    break;
	    case 3:
		$start = $iCurrentTimekey - ($units['day']);
		$period = date("Y-m-d H:i:s", $start);
		$pointsWanted = 12*24;
	    break;
	    case 4:
		$start = $iCurrentTimekey - ($units['day']*3);
		$period = date("Y-m-d H:i:s", $start);
		$pointsWanted = 12*24*3;
	    break;
	}

	if($aArgs['all']){
		$query = "SELECT (A.value) AS value, UNIX_TIMESTAMP(A.timestamp) as timestamp FROM (SELECT SUM( value ) AS value, TIMESTAMP AS TIMESTAMP FROM power_logs WHERE device_id NOT BETWEEN 8000 AND 9000 AND timestamp >= '" .$period. "' GROUP BY TIMESTAMP)A, (SELECT SUM( value ) AS value, TIMESTAMP FROM power_logs WHERE device_id BETWEEN 8000 AND 9000 AND timestamp >= '" .$period. "' GROUP BY TIMESTAMP)B WHERE A.timestamp = B.timestamp LIMIT ".$pointsWanted;
	}
	else if($aArgs['net']){
		$query = "SELECT (A.value - B.value) AS value, UNIX_TIMESTAMP(A.timestamp) as timestamp FROM (SELECT SUM( value ) AS value, TIMESTAMP AS TIMESTAMP FROM power_logs WHERE device_id NOT BETWEEN 8000 AND 9000 AND timestamp >= '" .$period. "' GROUP BY TIMESTAMP)A, (SELECT SUM( value ) AS value, TIMESTAMP FROM power_logs WHERE device_id BETWEEN 8000 AND 9000 AND timestamp >= '" .$period. "' GROUP BY TIMESTAMP)B WHERE A.timestamp = B.timestamp LIMIT ".$pointsWanted;
	}
	else{
	//device Id list case
		$sArg = '';
		$first = 1;
		foreach($aArgs['devices'] as $index => $d){
		if($index) $sArg.=' OR device_id = ';
		  $sArg.=$d;
		}
		$query = "SELECT (A.value) AS value, UNIX_TIMESTAMP(A.timestamp) as timestamp FROM (SELECT SUM( value ) AS value, TIMESTAMP AS TIMESTAMP FROM power_logs WHERE (device_id = " .$sArg. ") AND timestamp >= '" .$period. "' GROUP BY TIMESTAMP)A, (SELECT SUM( value ) AS value, TIMESTAMP FROM power_logs WHERE (device_id = " .$sArg. ") AND timestamp >= '" .$period. "' GROUP BY TIMESTAMP)B WHERE A.timestamp = B.timestamp LIMIT ".$pointsWanted;
		//echo $query . "\n";	
	} 

	//do the query
	if( !$r = DB::query($query) ) {
		//echo mysql_error();
	}
	
	$i = 0;
	$aData = array();
	if($r)
	while( $aRow = mysql_fetch_assoc($r) )
		$aData[$i++] = $aRow;

	if(!$aData) {
		$aGUIStatus['start'] = $start*1000;
		$aGUIStatus['data'][0] = array($start*1000,0);
		$aGUIStatus['data'][1] = array(($start+5*60*$pointsWanted)*1000, 0);	
	}
	// Now aData is in format (value,timestamp)
	foreach($aData as $index => $aRow) {
		if(!$index) $aGUIStatus['start'] = intval($aRow['timestamp'])*1000;
		$aGUIStatus['data'][$index] = array(intval($aRow['timestamp'])*1000, round(floatval($aRow['value']), 2));
	}

	echo json_encode($aGUIStatus);
