Lưu ý:
1.Sẽ luôn chỉ có một hành động tạo đơn hàng một thời điểm để tránh việc tồn kho không đủ.
2.Một đơn hàng mà có số điện thoại khách hàng và danh sách các sản phẩm trùng nhau thì sẽ coi là một đơn hàng trùng và sẽ k tạo được đơn hàng,đồng thời phản hồi cho phía client biết.
3.Mọi chức năng liên quan đến giá sản phẩm thì đều phải lưu lại giá sản phẩm tại thời điểm tạo bản ghi phòng trường hợp có sự cập nhật giá sản phẩm sẽ k làm hỏng các hóa đơn cũ.
4.Mọi bản xóa đều là bản xóa mềm,set thuộc tính là đã xóa k phải xóa bỏ bản ghi trong database.
5.Một sản phẩm muốn xóa bỏ thì tồn kho phải bằng 0.
6.Một sản phẩm luôn phải có tối thiểu một biến thể 0 hay gọi cách khác là biến thể không thuộc tính.
7.Tạo một bảng ghi lại những thay đổi của cập nhật giá sản phẩm và biến thể,cập nhật kho,cập nhật hóa đơn và xóa đơn hàng.