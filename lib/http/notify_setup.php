<?php

$query = "SELECT alias FROM door_states";
$result = mysql_query($query) or die(mysql_error());

while($row = mysql_fetch_array($result)) {

	$aNotifications [ $row['alias'] ] = 0;
}

$query = "SELECT alias FROM controller_state";
$result = mysql_query($query) or die(mysql_error());

while($row = mysql_fetch_array($result)) {

	$aNotifications [ $row['alias'] ] = 0;
}

?>
