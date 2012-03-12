<?php

require_once( '/home/uiucsd/www/uiucrehome/lib/http/bootstrap.php' );

$sql = "SELECT `code`,`value` FROM `cerv_status`";
$result = mysql_query($sql) or die(mysql_error());


$cervStatus = array('z1t'=>0,'z2t'=>0,'z1h'=>0,'z2h'=>0,'cd1'=>0,'cd2'=>0,'ost'=>0,'osh'=>0,'hwt'=>0,'fq1'=>0,'fq2'=>0,'vrm'=>0,'chm'=>0,'blr'=>0,'tfi'=>0,'tti'=>0,'tfo'=>0,'tto'=>0,'pkp'=>0,'pki'=>0,'pkd'=>0,'mod'=>0); 
       
while($row = mysql_fetch_array($result)) {
	$cervStatus[$row['code']] = $row['value'];
	//echo $row['code'] . ' => ' . $row['value'] . "\n";
}
echo json_encode($cervStatus);

?>
