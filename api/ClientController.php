<?php
class ClientController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function handleRequest($method, $id = null) {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $this->getClient($id);
                } else {
                    $this->getClients();
                }
                break;
            case 'POST':
                $this->createClient();
                break;
            case 'PUT':
                $this->updateClient($id);
                break;
            case 'DELETE':
                $this->deleteClient($id);
                break;
            default:
                header("HTTP/1.1 405 Method Not Allowed");
                break;
        }
    }

    private function getClients() {
        $query = "SELECT * FROM clients";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($clients);
    }

    private function getClient($id) {
        $query = "SELECT * FROM clients WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$id]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($client) {
            echo json_encode($client);
        } else {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(["message" => "Client not found"]);
        }
    }

    private function createClient() {
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO clients (name, email, whatsapp, license_period, tag, comments, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH))";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([
            $data->name,
            $data->email,
            $data->whatsapp,
            $data->licensePeriod,
            $data->tag,
            $data->comments,
            $data->licensePeriod
        ])) {
            $data->id = $this->db->lastInsertId();
            echo json_encode($data);
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Failed to create client"]);
        }
    }

    private function updateClient($id) {
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE clients SET name = ?, email = ?, whatsapp = ?, license_period = ?, tag = ?, comments = ?, end_date = DATE_ADD(start_date, INTERVAL ? MONTH) WHERE id = ?";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([
            $data->name,
            $data->email,
            $data->whatsapp,
            $data->licensePeriod,
            $data->tag,
            $data->comments,
            $data->licensePeriod,
            $id
        ])) {
            echo json_encode(["message" => "Client updated successfully"]);
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Failed to update client"]);
        }
    }

    private function deleteClient($id) {
        $query = "DELETE FROM clients WHERE id = ?";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([$id])) {
            echo json_encode(["message" => "Client deleted successfully"]);
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Failed to delete client"]);
        }
    }

    public function getDashboardData() {
        $query = "SELECT COUNT(*) as total_clients, SUM(license_period * 4) as total_revenue FROM clients";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }

    public function getNotifications() {
        $query = "SELECT * FROM clients WHERE end_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 5 DAY)";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $notifications = array_map(function($client) {
            return [
                "message" => "La licencia de {$client['name']} caducará el {$client['end_date']}",
                "clientId" => $client['id']
            ];
        }, $clients);
        
        echo json_encode($notifications);
    }
}