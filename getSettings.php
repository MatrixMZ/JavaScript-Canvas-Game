<?php 
    require "database.php"; // gets the Database() helper object


    // creates new database object to connect with database
    $database = new Database();

    // returns the result of the qiven query
    // in this case it is the list of difficulty modes for the game,
    // the result is converted to JSON string
    $database->executeQuery("SELECT * FROM settings");
?>
