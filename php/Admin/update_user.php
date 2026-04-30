<?php
$conn = new mysqli("localhost", "root", "", "users");

if ($conn->connect_error) {
    die("Connection failed");
}

$id    = $_POST['id'] ?? '';
$name  = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';

$stmt = $conn->prepare("UPDATE users SET name=?, email=? WHERE id=?");
$stmt->bind_param("ssi", $name, $email, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "updated"]);
} else {
    echo json_encode(["status" => "error"]);
}

$conn->close();
?>