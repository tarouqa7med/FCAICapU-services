document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);

    fetch("../php/register.php", {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            let msg = document.getElementById("msg");
            msg.innerText = data.message;

            if (data.status === "success") {
                msg.style.color = "green";

                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1500);
            } else {
                msg.style.color = "red";
            }
        });
    });
