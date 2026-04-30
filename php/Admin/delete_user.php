<?php
$conn = new mysqli("localhost", "root", "", "users");

if ($conn->connect_error) {
    die("Connection failed");
}

$id = $_POST['id'] ?? '';

$stmt = $conn->prepare("DELETE FROM users WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "deleted"]);
} else {
    echo json_encode(["status" => "error"]);
}

$conn->close();
?>