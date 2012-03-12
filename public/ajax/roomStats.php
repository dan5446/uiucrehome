<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

if ( !isset($_POST['arguments']) || empty($_POST['arguments']) ) { 
	echo "No Status Sent\n";
}
	echo $_POST['arguments'];
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
	$date = date("Y-m-d H:i:s", $iCurrentTimekey);
        //echo $date."\n";
	$dev = '';
	foreach($aArgs['devices'] as $index => $d){
		if($index) $dev.=' OR ';
		  $dev.=$d;
	}
        // Past day production
	$iCurrentTime = $iCurrentTimekey - $units['day'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);
        $aOptions['fields'] = "sum(kwh) as day";
        $aOptions['where'] = "`timestamp` >= '". $date . "' AND device_id = ".$dev;

        $aOptions['limit'] = '1';
        
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

        // Past week production
	$iCurrentTime = $iCurrentTimekey - $units['week'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);
        $aOptions['fields'] = "sum(kwh) as week";
        $aOptions['where'] = "`timestamp` >= '". $date . "' AND device_id = ".$dev;
        $aOptions['limit'] = '1';
        
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}


	$aOptions['fields'] = "SUM(value) as latest";
        $aOptions['where'] = "device_id != 8003 AND timestamp = (select max(timestamp) from power_logs)";
        $aOptions['limit'] = '1';
	$aLog = $oPowerLogs->select($aOptions);
	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

	echo json_encode($aGUIStatus);
