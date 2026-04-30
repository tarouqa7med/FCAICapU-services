<?php

session_start();

$conn = new mysqli("localhost", "root", "", "users");

header('Content-Type: application/json');

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validation
    if (empty($email) || empty($password)) {
        echo json_encode([
            "status" => "error",
            "message" => "All fields are required"
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email format"
        ]);
        exit;
    }

    // Check user
    $stmt = $conn->prepare("SELECT id, first_name, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Email not found"
        ]);
        exit;
    }

    $user = $result->fetch_assoc();

    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Incorrect password"
        ]);
        exit;
    }

    // Save session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['first_name'] = $user['first_name'];
    $_SESSION['role'] = $user['role'];

    // =========================
    // 🔥 FINAL RESPONSE (UPDATED)
    // =========================

    if ($user['role'] === 'admin') {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "first_name" => $user['first_name'],
            "role" => $user['role'],
            "redirect" => "../html/Admin/admin.html"
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "first_name" => $user['first_name'],
            "role" => $user['role'],
            "redirect" => "../index.html"
        ]);
    }

    $stmt->close();
    $conn->close();
}
?>