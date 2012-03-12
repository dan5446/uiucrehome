<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

if ( !isset($_POST['status']) || empty($_POST['status']) ) { 
	echo "No Status Sent\n";
}
else { 
	$aGUIStatus = json_decode(stripslashes($_POST['status']), true);

	$aOptions['where'] = "code = 'z1t' OR code = 'z2t' OR code = 'z1h' OR code = 'z2h' OR code = 'cd1' OR code = 'cd2' OR code = 'ost' OR code = 'osh' OR code = 'hwt' OR code = 'vrm' OR code = 'chm'";
	$aSensorData = $oCERV->select($aOptions);
        

	// Get log data
	foreach( $aSensorData as $k => $aRow )
	{
		$aGUIStatus[$aRow['code']] = $aRow['value'];
	

	}

	echo json_encode($aGUIStatus);

}
