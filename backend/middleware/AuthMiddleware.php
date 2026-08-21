<?php
// backend/middleware/AuthMiddleware.php
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = apache_request_headers();
        $authHeader = null;
        
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }

        if ($authHeader) {
            $token = str_replace('Bearer ', '', $authHeader);
            $jwt = new JwtHandler();
            $decoded = $jwt->decode($token);
            if ($decoded) {
                return $decoded; // Return user info
            }
        }
        
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized access."]);
        exit();
    }
}
?>
