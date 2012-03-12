<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

function executeCommand( $command, $value ) {
	$fetchStatus	= 1;
	if($command == $fetchStatus) {
		exec( '/home/uiucsd/www/uiucrehome/can2go/CERVquery.py');
		echo 'Success';
	}
	else {
		exec( '/home/uiucsd/www/uiucrehome/can2go/CERVcommander.py '.$command.' '.$value, $out );
		$out = $out[0];
		echo $out;
	}
}

if ( !isset($_POST['command']) || empty($_POST['command']) ) { 
	echo "Error, No Command Number Received".date(' l jS \of F Y h:i:s A')."\n";
	return -1;
}
else { 
	$cmd = $_POST['command'];
	$cmd = intval($cmd);
	if ($cmd > 0 && $cmd < 14) {
		if($cmd > 1 && $cmd < 14) {
			
				$dat = $_POST['value'];
				$dat = intval($dat);
				executeCommand( $cmd, $dat );
			
		}
		else {
			executeCommand( $cmd, 0 );
		}	
	}
	else {
		echo "Invalid Command Number Selected".date(' l jS \of F Y h:i:s A')."\n";
		return -1;
	}
}

?>
