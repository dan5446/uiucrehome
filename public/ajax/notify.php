
<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

$query = "SELECT alias, value, timestamp FROM controller_state";
$result = mysql_query($query) or die(mysql_error());
$doorMonitorConnected = 1;
while($row = mysql_fetch_array($result)) {

	//SHOW NOTIFICATION IF ANY CONTROLLER IS UNPLUGGED
	if( ((time() - strtotime($row['timestamp'])) > 30) && ($row['value'] == 0) ) {
		if($aNotifications[ $row['alias'] ] == '0') {
			$aNotifications[ $row['alias'] ] = 1;
			if($row['alias'] == 'Door Monitor') $doorMonitorConnected = 0;
			$aNotifyReturn[] = $row['alias'] . " is disconnected";
		}
	}
}
$query = "SELECT alias FROM controller_state WHERE value = 1";
$result = mysql_query($query) or die(mysql_error());

while($row = mysql_fetch_array($result)) {
	$aNotifications[ $row['alias'] ] = 0;
}

if($doorMonitorConnected) {
	$query = "SELECT timestamp, alias FROM door_states WHERE state = 0 and device_id > 201";
	$result = mysql_query($query) or die(mysql_error());

	while($row = mysql_fetch_array($result)) {
			if($aNotifications[ $row['alias'] ] === 0) {
				$aNotifications[ $row['alias'] ] = 1;
				$aNotifyReturn[] = $row['alias'] . " is open";
			}
	}

	$query = "SELECT alias FROM door_states WHERE state = 1";
	$result = mysql_query($query) or die(mysql_error());

	while($row = mysql_fetch_array($result)) {
		$aNotifications[ $row['alias'] ] = 0;
	}
}

echo json_encode($aNotifyReturn);

?>
