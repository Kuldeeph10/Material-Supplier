<?php
// backend/public/index.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Find the base path for local development (e.g., /material_supplier/backend/public)
$base_index = array_search('api', $uri);

if ($base_index === false || !isset($uri[$base_index + 1])) {
    http_response_code(404);
    echo json_encode(["message" => "Not Found. Use /api/..."]);
    exit();
}

$resource = $uri[$base_index + 1];
$id = isset($uri[$base_index + 2]) ? $uri[$base_index + 2] : null;

require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/CustomerController.php';
require_once __DIR__ . '/../controllers/OrderController.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($resource) {
    case 'auth':
        $controller = new AuthController();
        if ($method === 'POST' && $id === 'login') {
            $controller->login();
        } elseif ($method === 'GET' && $id === 'me') {
            $user = AuthMiddleware::authenticate();
            $controller->me($user);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Endpoint not found"]);
        }
        break;

    case 'customers':
        AuthMiddleware::authenticate();
        $controller = new CustomerController();
        if ($method === 'GET') {
            $controller->getAll();
        } elseif ($method === 'POST') {
            $controller->create();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;

    case 'orders':
        AuthMiddleware::authenticate();
        $controller = new OrderController();
        if ($method === 'GET') {
            if ($id) {
                $controller->getOne($id);
            } else {
                $controller->getAll();
            }
        } elseif ($method === 'POST') {
            $controller->create();
        } elseif ($method === 'PATCH' && $id) {
            $action = isset($uri[$base_index + 3]) ? $uri[$base_index + 3] : null;
            $data = json_decode(file_get_contents("php://input"));
            
            if ($action === 'complete' || (isset($data->status) && $data->status === 'COMPLETED')) {
                $controller->updateStatus($id, 'COMPLETED');
            } elseif ($action === 'cancel' || (isset($data->status) && $data->status === 'CANCELLED')) {
                $controller->updateStatus($id, 'CANCELLED');
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Invalid action or status"]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Resource not found"]);
        break;
}
?>
