<?php
// backend/controllers/AuthController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthController {
    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->email) && !empty($data->password)) {
            $database = new Database();
            $db = $database->getConnection();
            $user = new User($db);
            
            if ($user->login($data->email, $data->password)) {
                $jwt = new JwtHandler();
                $token = $jwt->encode([
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role
                ]);
                
                http_response_code(200);
                echo json_encode([
                    "message" => "Login successful.",
                    "token" => $token,
                    "user" => [
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "role" => $user->role
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["message" => "Invalid email or password."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }
    
    public function me($user_data) {
        http_response_code(200);
        echo json_encode([
            "message" => "Authenticated",
            "user" => $user_data
        ]);
    }
}
?>
