function load_json(dataset, tbbody) {
    var tableBody = document.getElementById(tbbody);
    if (!tableBody) {
        console.error("Product table body not found:", tbbody);
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", dataset, true);

    xhr.onload = function () {
        if (xhr.status < 200 || xhr.status >= 300) {
            console.error("Failed to load product data:", xhr.status, dataset);
            showMessage("Không thể tải dữ liệu sản phẩm.");
            return;
        }

        var products;
        try {
            products = JSON.parse(xhr.responseText);
        } catch (error) {
            console.error("Invalid JSON in product data:", error);
            showMessage("Dữ liệu sản phẩm không phải JSON hợp lệ.");
            return;
        }

        if (!Array.isArray(products)) {
            console.error("Product data must be a JSON array:", dataset);
            showMessage("Dữ liệu sản phẩm phải có định dạng mảng JSON.");
            return;
        }

        tableBody.replaceChildren();
        products.forEach(function (product) {
            var row = document.createElement("tr");

            [product.id, product.name, product.price].forEach(function (value) {
                var cell = document.createElement("td");
                cell.textContent = value === undefined || value === null ? "" : value;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    };

    xhr.onerror = function () {
        console.error("Network error while loading product data:", dataset);
        showMessage("Có lỗi mạng khi tải dữ liệu sản phẩm.");
    };

    xhr.send();

    function showMessage(message) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.colSpan = 3;
        cell.textContent = message;
        row.appendChild(cell);
        tableBody.replaceChildren(row);
    }
}