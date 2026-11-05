# Trang giá vàng

Mở Terminal tại thư mục **HỌC CODE**, chạy:

```sh
python3 call_external_api/serve_giavang.py
```

Mở **http://localhost:8000/giavang.html** trong trình duyệt. Dừng bằng `Ctrl+C`.
Nếu đã mở Terminal trong `call_external_api`, chạy `python3 serve_giavang.py`.
Nếu cổng 8000 đang bận, thêm `--port 8001` và mở địa chỉ tương ứng.

`giavang.html` chứa toàn bộ HTML, CSS và JavaScript; không cần cài thư viện.
Trang đọc JSON bất đồng bộ bằng `new XMLHttpRequest()` trong hàm `requestJSON()`.
API được thử trực tiếp trước; nếu bị chặn CORS, trang gọi `/api/gold` trên máy chủ đi kèm.
Máy chủ Python chuyển tiếp đúng API VnExpress, không sử dụng dịch vụ proxy công cộng.
Mở file bằng cách nhấp đúp hoặc dùng Live Server thông thường sẽ không giải quyết CORS khi nguồn chưa cho phép.

- API: https://gw.vnexpress.net/cr/?name=tygia_vangv202206
- Giá hiện tại: `response.data.data.gold.new`; kỳ trước: `gold.old`.
- Lịch sử: `response.data.data.chart`; ngày dữ liệu: `date_label` của từng loại vàng.
- Giá trong nước được quy đổi từ nghìn đồng/lượng sang triệu đồng/lượng hoặc đồng/lượng.
- Vàng thế giới hiển thị riêng, đơn vị USD/ounce, không gộp với giá trong nước.
- Bảng hỗ trợ tìm kiếm không dấu, lọc thương hiệu, sắp xếp, chọn loại vàng và xuất các dòng đang lọc ra CSV UTF-8.
- Biểu đồ dùng lịch sử thực tế 7 hoặc 30 ngày; quy đổi dùng giá mua/bán đúng theo giao dịch bạn chọn.
- Nếu cập nhật thất bại, trang báo lỗi và ghi rõ khi đang giữ dữ liệu từ lần tải trước. Không có giá mẫu giả làm dữ liệu trực tiếp.
