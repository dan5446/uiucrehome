<?php

class PowerLogs extends dbObject
{
  protected $sTable    = 'power_logs';
  protected $aColumns  = array( 'device_id'
                               ,'value'
                               ,'timestamp'
                              );

  public function __construct( $aOptions = array() )
  {
    return true;
  }
}
