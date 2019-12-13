<?php
/**
 * This is helper class to help operate on to the Postgres database.
 */
class Database {
    private $connection; // stores the PDO object with connection to the database

    /**
     * connects to the database when the object is created
     */
    public function __construct() {
        $this->connectToDatabase();
    }

    /**
     * Creates the connection string and tries to connect to the database
     */
    public function connectToDatabase() {
        $db_user = '';
        $db_pass = '';

        $db_driver = 'pgsql';
        $db_host = '';
        $db_name = '';
        $data_source_name = "$db_driver:host=$db_host;dbname=$db_name";
        try {
            $this->connection = new PDO($data_source_name, $db_user, $db_pass);
        } catch (PDOException $e) {
            echo $e->getMessage();
            return NULL;
        }
    }

    /**
     * Takes the SQL string with query like SELECT * FROM ?
     * and returns the result of the query as the parsed JSON object
     */
    public function executeQuery($query) {
        $request = $this->connection->prepare($query);
        $request->execute();

        // converts the result to the associative array that is easy to be converted to the JSON string
        $rows = array();
        while($r = $request->fetch(PDO::FETCH_ASSOC)) {
            $rows[] = $r;
        }

        header('Content-Type: application/json');
        print json_encode($rows); // returning the result as JSON string
    }
}

?>
