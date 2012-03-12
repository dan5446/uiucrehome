<?php

class CERV extends dbObject
{
  protected $sTable    = 'cerv_status';
  protected $aColumns  = array( 'code'
                               ,'description'
                               ,'value'
                               ,'timestamp'
                              );
  protected $sID       = 'code';

  public function __construct( $aOptions = array() )
  {
    return true;
  }
}
