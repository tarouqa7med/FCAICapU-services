<?php
                $conn = new mysqli("localhost", "root", "", "users");

                header('Content-Type: application/json');

                if ($conn->connect_error) {
                    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
                    exit;
                }

                if ($_SERVER["REQUEST_METHOD"] == "POST") {

                    $first_name = trim($_POST['first_name']);
                    $last_name  = trim($_POST['last_name']);
                    $email      = trim($_POST['email']);
                    $password   = $_POST['password'];

                    // validation
                    if (empty($first_name) || empty($last_name) || empty($email) || empty($password)) {
                        echo json_encode(["status" => "error", "message" => "All fields are required"]);
                        exit;
                    }

                    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
                        exit;
                    }

                    if (
                        strlen($password) < 8 ||
                        !preg_match('/[A-Z]/', $password) ||
                        !preg_match('/[a-z]/', $password) ||
                        !preg_match('/[0-9]/', $password) ||
                        !preg_match('/[\W]/', $password)
                    ) {
                        echo json_encode(["status" => "error", "message" => "Weak password"]);
                        exit;
                    }

                    // check email exists
                    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
                    $check->bind_param("s", $email);
                    $check->execute();
                    $check->store_result();

                    if ($check->num_rows > 0) {
                        echo json_encode(["status" => "error", "message" => "Email already exists"]);
                        exit;
                    }

                    $check->close();

                    // insert user
                    $hashed = password_hash($password, PASSWORD_DEFAULT);

                    $stmt = $conn->prepare(
                        "INSERT INTO users (first_name, last_name, email, password)
                        VALUES (?, ?, ?, ?)"
                    );

                    $stmt->bind_param("ssss", $first_name, $last_name, $email, $hashed);

                    if ($stmt->execute()) {
                        echo json_encode([
                            "status" => "success",
                            "message" => "Registration successful"
                        ]);
                    } else {
                        echo json_encode([
                            "status" => "error",
                            "message" => "Something went wrong"
                        ]);
                    }

                    $stmt->close();
                }
                ?>