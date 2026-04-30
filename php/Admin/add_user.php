<?php
$conn = new mysqli("localhost", "root", "", "users");

if ($conn->connect_error) {
    die("Connection failed");
}

$name  = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';

$stmt = $conn->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}

$conn->close();
?>