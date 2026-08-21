<?php
// backend/controllers/OrderController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Customer.php';

class OrderController {
    private $db;
    private $order;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->order = new Order($this->db);
    }

    public function getAll() {
        $stmt = $this->order->readAll();
        $num = $stmt->rowCount();

        $orders_arr = array();
        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                array_push($orders_arr, $row);
            }
        }
        http_response_code(200);
        echo json_encode($orders_arr);
    }
    
    public function getOne($id) {
        $this->order->id = $id;
        if($this->order->readOne()) {
            http_response_code(200);
            echo json_encode([
                "id" => $this->order->id,
                "customer_id" => $this->order->customer_id,
                "customer_name" => $this->order->customer_name,
                "customer_phone" => $this->order->customer_phone,
                "requirement" => $this->order->requirement,
                "quantity" => $this->order->quantity,
                "unit" => $this->order->unit,
                "location" => $this->order->location,
                "notes" => $this->order->notes,
                "status" => $this->order->status,
                "created_at" => $this->order->created_at,
                "completed_at" => $this->order->completed_at
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Order not found."]);
        }
    }

    public function create() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->customer_name) && !empty($data->customer_phone) && !empty($data->requirement)) {
            
            // First check if customer exists by phone, if not create
            $customer = new Customer($this->db);
            $stmt = $customer->searchByPhone($data->customer_phone);
            
            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $customer_id = $row['id'];
            } else {
                $customer->name = $data->customer_name;
                $customer->phone = $data->customer_phone;
                $customer->create();
                $customer_id = $customer->id;
            }
            
            $this->order->customer_id = $customer_id;
            $this->order->requirement = $data->requirement;
            $this->order->quantity = isset($data->quantity) ? $data->quantity : null;
            $this->order->unit = isset($data->unit) ? $data->unit : null;
            $this->order->location = isset($data->location) ? $data->location : null;
            $this->order->notes = isset($data->notes) ? $data->notes : null;

            if($this->order->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Order created."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create order."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data. Requirement, customer name and phone are required."]);
        }
    }
    
    public function updateStatus($id, $status) {
        $this->order->id = $id;
        if($this->order->updateStatus($status)) {
            http_response_code(200);
            echo json_encode(["message" => "Order status updated to $status."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update order status."]);
        }
    }
}
?>
