<?php
// backend/middleware/AuthMiddleware.php
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
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
