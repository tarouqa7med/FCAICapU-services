<?php
$conn = new mysqli("localhost", "root", "", "users");

if ($conn->connect_error) {
    die("Connection failed");
}

$result = $conn->query("SELECT * FROM users");

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);

$conn->close();
?>