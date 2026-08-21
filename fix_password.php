<?php
require_once __DIR__ . '/backend/config/database.php';

$database = new Database();
$db = $database->getConnection();

$email = "admin@example.com";
$password = "password123";
$hash = password_hash($password, PASSWORD_DEFAULT);

$query = "UPDATE users SET password_hash = :hash WHERE email = :email";
$stmt = $db->prepare($query);
$stmt->bindParam(':hash', $hash);
$stmt->bindParam(':email', $email);
$stmt->execute();

echo "Password for admin@example.com has been updated to 'password123'. You can now login.";
?>
