
<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

if ( !isset($_POST['status']) || empty($_POST['status']) ) { 
	echo "No Status Sent\n";
}

	//$aGUIStatus = json_decode(stripslashes($_POST['status']), true);
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

        // Past hour consumption
	$iCurrentTime = $iCurrentTimekey - $units['hour'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);

	$aOptions['fields'] = "sum(kwh) as clh";
        $aOptions['where'] = "`timestamp` >= '". $date . "' AND device_id NOT BETWEEN 8000 and 9000";
	$aOptions['order_by'] = ''; 
        $aOptions['limit'] = '1';
        
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

        // Past day consumption
	$iCurrentTime = $iCurrentTimekey - $units['day'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);
        //echo $date."\n";
        $aOptions['fields'] = "sum(kwh) as cld";
        $aOptions['where'] = "`timestamp` >= '". $date . "' AND device_id NOT BETWEEN 8000 and 9000 AND value > 0";
        $aOptions['limit'] = '1';
        
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

        // Past week consumption
	$iCurrentTime = $iCurrentTimekey - $units['week'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);
        $aOptions['fields'] = "sum(kwh) as clw";
        $aOptions['where'] = "`timestamp` >= '". $date . "' AND device_id NOT BETWEEN 8000 and 9000 AND value > 0";
        $aOptions['limit'] = '1';
        
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

        // Past hour production
	$iCurrentTime = $iCurrentTimekey - $units['hour'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);
        $aOptions['fields'] = "sum(kwh) as plh";
        $aOptions['where'] = "device_id = 8003 AND `timestamp` >= '". $date . "' ";

        $aOptions['limit'] = '1';
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

        // Past day production
	$iCurrentTime = $iCurrentTimekey - $units['day'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);
        $aOptions['fields'] = "sum(kwh) as pld";
        $aOptions['where'] = "`timestamp` >= '". $date . "' AND device_id = 8003 AND value > 0";

        $aOptions['limit'] = '1';
        
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

        // Past week production
	$iCurrentTime = $iCurrentTimekey - $units['week'];
	$date = date("Y-m-d H:i:s", $iCurrentTime);
        $aOptions['fields'] = "sum(kwh) as plw";
        $aOptions['where'] = "`timestamp` >= '". $date . "' AND device_id = 8003 AND value > 0";

        $aOptions['limit'] = '1';
        
	$aLog = $oPowerLogs->select($aOptions);

	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow),2);
	}

	$aOptions['fields'] = "max(`timestamp`)";
	$aOptions['where'] = '';
	$aLog = $oPowerLogs->select($aOptions);
	foreach( $aLog as $k => $aRow ) {
	    $latest = $aRow;
	}
	$aOptions['fields'] = "SUM(value) as production";
        $aOptions['where'] = "device_id = 8003 AND timestamp = (select max(timestamp) from power_logs)";
        $aOptions['limit'] = '1';
	$aLog = $oPowerLogs->select($aOptions);
	foreach( $aLog as $k => $aRow ) {
	    $aGUIStatus[$k] = round(floatval($aRow), 2);
	}

	$aOptions['fields'] = "SUM(value) as consumption";
        $aOptions['where'] = "device_id != 8003 AND timestamp = (select max(timestamp) from power_logs)";
        $aOptions['limit'] = '1';
	$aLog = $oPowerLogs->select($aOptions);
	foreach( $aLog as $k => $aRow ) {
	    $latestCons = $aRow;
	}
	$aGUIStatus['surplus'] = ($aGUIStatus['production'] > floatval($latestCons));
	$aGUIStatus['consumption'] = round(floatval($latestCons),2);

	$aOptions['fields'] = "SUM(kwh) as production";
        $aOptions['where'] = "device_id = 8003 AND timestamp >= '2011-09-21 08:00:00'";
        $aOptions['limit'] = '1';
	$aLog = $oPowerLogs->select($aOptions);
	foreach( $aLog as $k => $aRow ) {
	    $netP = round(floatval($aRow), 2);
	}

	$aOptions['fields'] = "SUM(kwh) as consumption";
        $aOptions['where'] = "device_id != 8003 AND timestamp >= '2011-09-21 08:00:00'";
        $aOptions['limit'] = '1';
	$aLog = $oPowerLogs->select($aOptions);
	foreach( $aLog as $k => $aRow ) {
	    $netC = $aRow;
	}
	//$aGUIStatus['surplus'] = ($aGUIStatus['production'] > floatval($latestCons));
	$aGUIStatus['net'] = round((floatval($netC)-floatval($netP)),2);


	echo json_encode($aGUIStatus);
