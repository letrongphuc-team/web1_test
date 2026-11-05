function loadBookData(dataset) {
    var xhr = new XMLHttpRequest();
    var studentId = document.getElementById("student-id");
    var studentName = document.getElementById("student-name");
    var studentSummary = document.getElementById("student-summary");
    var tableBody = document.getElementById("tbBooks");
    var status = document.getElementById("load-status");

    xhr.open("GET", dataset, true);
    xhr.onload = function () {
        if (xhr.status < 200 || xhr.status >= 300) {
            showError("Không thể tải dữ liệu sách.");
            return;
        }

        var student;
        try {
            student = JSON.parse(xhr.responseText);
        } catch (error) {
            console.error("JSON không hợp lệ:", error);
            showError("Tệp dữ liệu không phải JSON hợp lệ.");
            return;
        }

        if (!student || !Array.isArray(student.Sachs)) {
            showError("Dữ liệu sinh viên hoặc danh sách sách không hợp lệ.");
            return;
        }

        function updateStudentSummary() {
            studentSummary.textContent = [studentId.value.trim(), studentName.value.trim()]
                .filter(Boolean)
                .join(" ");
        }

        studentId.addEventListener("input", updateStudentSummary);
        studentName.addEventListener("input", updateStudentSummary);
        updateStudentSummary();

        var books = student.Sachs.slice().sort(function (first, second) {
            return Number(first.Trang) - Number(second.Trang);
        });

        tableBody.replaceChildren();
        if (books.length === 0) {
            showError("Sinh viên hiện không mượn sách nào.");
            return;
        }

        books.forEach(function (book) {
            var row = document.createElement("tr");
            [book.Ma, book.Ten, book.Trang].forEach(function (value) {
                var cell = document.createElement("td");
                cell.textContent = value === undefined || value === null ? "" : value;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    };

    xhr.onerror = function () {
        showError("Lỗi mạng khi tải dữ liệu sách.");
    };

    xhr.send();

    function showError(message) {
        status.textContent = message;
        tableBody.replaceChildren();
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.colSpan = 3;
        cell.textContent = message;
        row.appendChild(cell);
        tableBody.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadBookData("dataset/book.json");
});