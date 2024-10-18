<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config.php';
require_once 'Database.php';
require_once 'ClientController.php';
require_once 'AuthController.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

$requestMethod = $_SERVER["REQUEST_METHOD"];

$database = new Database();
$db = $database->getConnection();

$clientController = new ClientController($db);
$authController = new AuthController($db);

if ($uri[1] === 'login') {
    $authController->login($requestMethod);
} elseif ($uri[1] === 'clients') {
    if (isset($uri[2])) {
        $clientId = (int) $uri[2];
        $clientController->handleRequest($requestMethod, $clientId);
    } else {
        $clientController->handleRequest($requestMethod);
    }
} elseif ($uri[1] === 'dashboard') {
    $clientController->getDashboardData();
} elseif ($uri[1] === 'notifications') {
    $clientController->getNotifications();
} else {
    header("HTTP/1.1 404 Not Found");
    exit();
}