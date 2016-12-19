<?php
 require 'classes/OpenGraph.php';
/*if(empty($_GET['str']){
    exit;
}*/

if($_GET["str"]){
   
    $o = OpenGraph::fetch($_GET['str']);
    //echo"<PRE>"; print_r($o);
    echo json_encode($o->getCurrentValues());
}
exit;
