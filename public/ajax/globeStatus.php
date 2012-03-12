<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

$globeList = array('9003'=>'#d0000', '2004'=>'#d0013', '2006'=>'#d0014', '9001'=>'#d0015', '9004'=>'#d0016', '9002'=>'#d0017', '2003'=>'#d0018', '9005'=>'#d0019', '2002'=>'#d0020', '2001'=>'#d0021', '2005'=>'#d0022', '2007'=>'#d0022', '9006'=>'#d0023', '2008'=>'#d0024');
$units = array ( 
	'year' 	=> 29030400,
	'month' => 2419200,
	'week' 	=> 604800,
	'day'	=> 86400,
	'hour'	=> 3600,
	'minute'=> 60,
	'second'=> 1 
);

if ( !isset($_POST['status']) || empty($_POST['status']) ) { 
	echo "No Status Sent\n";
}
else { 
	$aGUIStatus = json_decode(stripslashes($_POST['status']), true);
	//fetch the latest log entry from the database and post that data back to the gui
	$iCurrentTimekey = time();

        // Past hour consumption
	$iCurrentTimekey = $iCurrentTimekey - ($units['minute']*5);
	$date = date("Y-m-d H:i:s", $iCurrentTimekey);
        $aOptions['fields'] = "device_id, sum(value) as value";
        $aOptions['where'] = "timestamp >= '". $date . "' AND device_id NOT BETWEEN 8000 and 9000"; // Those are inverter ids
	$aOptions['group_by'] = 'device_id';
	$aOptions['limit'] = '';
        
	$aLog = $oPowerLogs->select($aOptions);
	$washer = 0.0;
	$dryer = 0.0;
	foreach( $aLog as $k => $aRow ) {
		if(array_key_exists($aRow['device_id'], $globeList)){
			if($aRow['device_id'] == '2005') $dryer = floatval($aRow['value']); //washer/dryer have only one globe so aggregate
			if($aRow['device_id'] == '2007') $washer = floatval($aRow['value']);
			$statusKey = $globeList[$aRow['device_id']];
			$aGUIStatus[$statusKey] = round(floatval($aRow['value']),3);
		}
	}
	$aGUIStatus[$globeList['2005']] = round(floatval($dryer + $washer),3);
	echo json_encode($aGUIStatus);

}
