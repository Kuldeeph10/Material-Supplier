<?php
// backend/controllers/CustomerController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Customer.php';

class CustomerController {
    private $db;
    private $customer;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->customer = new Customer($this->db);
    }

    public function getAll() {
        $stmt = $this->customer->readAll();
        $num = $stmt->rowCount();

        if($num > 0) {
            $customers_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                array_push($customers_arr, $row);
            }
            http_response_code(200);
            echo json_encode($customers_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }

    public function create() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name) && !empty($data->phone)) {
            $this->customer->name = $data->name;
            $this->customer->phone = $data->phone;

            if($this->customer->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Customer created.", "id" => $this->customer->id]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create customer."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }
}
?>
