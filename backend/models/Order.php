<?php
// backend/models/Order.php

class Order {
    private $conn;
    private $table_name = "orders";

    public $id;
    public $customer_id;
    public $requirement;
    public $quantity;
    public $unit;
    public $location;
    public $notes;
    public $status;
    public $created_at;
    public $completed_at;
    
    public $customer_name;
    public $customer_phone;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $query = "SELECT o.*, c.name as customer_name, c.phone as customer_phone 
                  FROM " . $this->table_name . " o 
                  LEFT JOIN customers c ON o.customer_id = c.id 
                  ORDER BY o.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    public function readOne() {
        $query = "SELECT o.*, c.name as customer_name, c.phone as customer_phone 
                  FROM " . $this->table_name . " o 
                  LEFT JOIN customers c ON o.customer_id = c.id 
                  WHERE o.id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->customer_id = $row['customer_id'];
            $this->requirement = $row['requirement'];
            $this->quantity = $row['quantity'];
            $this->unit = $row['unit'];
            $this->location = $row['location'];
            $this->notes = $row['notes'];
            $this->status = $row['status'];
            $this->created_at = $row['created_at'];
            $this->completed_at = $row['completed_at'];
            $this->customer_name = $row['customer_name'];
            $this->customer_phone = $row['customer_phone'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET customer_id=:customer_id, requirement=:requirement, quantity=:quantity, 
                      unit=:unit, location=:location, notes=:notes, status='PENDING'";
        $stmt = $this->conn->prepare($query);

        $this->customer_id = htmlspecialchars(strip_tags($this->customer_id));
        $this->requirement = htmlspecialchars(strip_tags($this->requirement));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->unit = htmlspecialchars(strip_tags($this->unit));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->notes = htmlspecialchars(strip_tags($this->notes));

        $stmt->bindParam(":customer_id", $this->customer_id);
        $stmt->bindParam(":requirement", $this->requirement);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":unit", $this->unit);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":notes", $this->notes);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateStatus($new_status) {
        $query = "UPDATE " . $this->table_name . " SET status = :status";
        if ($new_status === 'COMPLETED') {
            $query .= ", completed_at = CURRENT_TIMESTAMP";
        }
        $query .= " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $new_status);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute();
    }
}
?>
