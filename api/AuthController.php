<?php
class AuthController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function login($method) {
        if ($method !== 'POST') {
            header("HTTP/1.1 405 Method Not Allowed");
            return;
        }

        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->username) || !isset($data->password)) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "Username and password are required"]);
            return;
        }

        $query = "SELECT * FROM users WHERE username = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$data->username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($data->password, $user['password'])) {
            // Generate a token or session here
            $token = bin2hex(random_bytes(16));
            
            echo json_encode([
                "message" => "Login successful",
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "token" => $token
                ]
            ]);
        } else {
            header("HTTP/1.1 401 Unauthorized");
            echo json_encode(["message" => "Invalid credentials"]);
        }
    }
}