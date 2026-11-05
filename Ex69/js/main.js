function loadEmployees(dataset) {
    var xhr = new XMLHttpRequest();
    var titleList = document.getElementById("titleList");
    var tableBody = document.getElementById("tbEmployees");
    var status = document.getElementById("status");
    var employees = [];

    xhr.open("GET", dataset, true);
    xhr.onload = function () {
        if (xhr.status < 200 || xhr.status >= 300) {
            showError("Không thể tải dữ liệu nhân viên.");
            return;
        }

        var xmlDoc = xhr.responseXML;
        if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length > 0) {
            showError("Dữ liệu nhân viên không phải XML hợp lệ.");
            return;
        }

        employees = Array.from(xmlDoc.getElementsByTagName("employee"));
        var titles = Array.from(new Set(employees
            .map(function (employee) {
                return employee.getAttribute("title");
            })
            .filter(Boolean)));

        titleList.replaceChildren();
        titles.forEach(function (title) {
            titleList.add(new Option(title, title));
        });

        if (titles.length === 0) {
            status.textContent = "Không tìm thấy chức vụ nào trong dữ liệu.";
            return;
        }
        titleList.value = titles[0];
        renderEmployees(titleList.value);
    };
    xhr.onerror = function () {
        showError("Có lỗi mạng khi tải dữ liệu nhân viên.");
    };
    xhr.send();

    titleList.addEventListener("change", function () {
        renderEmployees(titleList.value);
    });

    function renderEmployees(selectedTitle) {
        tableBody.replaceChildren();
        var matchingEmployees = employees.filter(function (employee) {
            return employee.getAttribute("title") === selectedTitle;
        });

        matchingEmployees.forEach(function (employee) {
            var row = document.createElement("tr");
            var id = employee.getAttribute("id") || "";
            var name = employee.getElementsByTagName("name")[0];
            var phone = employee.getElementsByTagName("phone")[0];

            [id, name ? name.textContent.trim() : "", phone ? phone.textContent.trim() : ""]
                .forEach(function (value) {
                    var cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });
            tableBody.appendChild(row);
        });

        status.textContent = matchingEmployees.length + " nhân viên có chức vụ " + selectedTitle + ".";
    }

    function showError(message) {
        titleList.replaceChildren(new Option("-- Không tải được chức vụ --", ""));
        tableBody.replaceChildren();
        status.textContent = message;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadEmployees("datasets/main.xml");
});