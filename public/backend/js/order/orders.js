window.onload = function(){
    const $ = document.querySelector.bind(document);
    function getOrder(url){
        fetch(url, {
            method: "GET"
        }).then(response => response.json())
        .then(data => {
            const result = data.map((order,index) =>{
                return `
                <tr>
                <td>${order.id}</td>
                <td>${order.fullname}</td>
                <td>${moment(order.created_at).format('L')}</td>
                <td>${order.status}</td>
                <td>${new Intl.NumberFormat('de-DE').format(order.total)}đ</td>
                <td><a href="order-detail.html?id=${order.id}" class="btn btn-sm btn-info">Chi tiết</a>
                    <button type="button" class="btn btn-sm btn-danger btn-remove" onclick="DeleteRow(${order.id})">Remove</button></td>
                </tr>
                `
            }).join("");
            $('#list-order').innerHTML = result;
        })
    }
    getOrder("http://localhost:3000/orders?_sort=id&_order=desc");
    let search_order = document.querySelector('#keyword');
    search_order.addEventListener('input', function () {
      getOrder(`http://localhost:3000/orders?fullname_like=${search_order.value}`)
    })
  }

function DeleteRow(id) {
    Swal.fire({
        title: 'Cảnh báo!',
        text: "Bạn chắc chắn muốn xóa tài khoản này?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý!'
    }).then((result) => {
        if (result.value) {
            let url = 'http://localhost:3000/orders/' + id;
            fetch(url, {
                method: "DELETE"
            }).then(function(res) {
                return res.json(); // chuyển chuỗi nhận được thành đối tượng json
            }).then(function(data) {
                // các lệnh xử lý cho dữ liệu ở đây: các công việc hiển thị.
                fetch("http://localhost:3000/order_detail?order_id="+id, {
                    method: "GET"
                  }).then(response => response.json())
                    .then(data => {
                      data.forEach(function (order, index, arr) {
                        remove_orderDetail(order.id);
                      })
                    });

                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa',
                    showConfirmButton: false,
                    timer: 1500
                })

                load_order();
            });
        }
    })
    return false;
}
function remove_orderDetail(id) {
    fetch("http://localhost:3000/order_detail/"+id, {
      method: "DELETE"
    }).then(function (res) {
      return res.json(); // chuyển chuỗi nhận được thành đối tượng json
    }).then(function (data) {
      console.log(data);
    });
  }
function load_order(){
    const API ="http://localhost:3000/orders?_sort=id&_order=desc";
    const $ = document.querySelector.bind(document);
    fetch(API, {
        method: "GET"
    }).then(response => response.json())
    .then(data => {
        const result = data.map((order,index) =>{
            return `
            <tr>
                <td>${order.id}</td>
                <td>${order.fullname}</td>
                <td>${moment(order.created_at).format('L')}</td>
                <td>${order.status}</td>
                <td>${new Intl.NumberFormat('de-DE').format(order.total)}đ</td>
                <td><a href="order-detail.html?id=${order.id}" class="btn btn-sm btn-info">Chi tiết</a>
                    <button type="button" class="btn btn-sm btn-danger btn-remove" onclick="DeleteRow(${order.id})">Remove</button></td>
                </tr>
            `
        }).join("");
        $('#list-order').innerHTML = result;
    })
}