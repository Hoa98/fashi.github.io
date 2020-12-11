window.onload = function(){
    const API ="http://localhost:3000/user?_sort=id&_order=desc";
    const $ = document.querySelector.bind(document);
    const getUser = () =>{
        fetch(API, {
            method: "GET"
        }).then(response => response.json())
        .then(data => {
            const result = data.map((user,index) =>{
                return `
                <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.fullname}</td>
                <td>${user.email}</td>
                <td><img src='${user.avatar}' width = "70"></td>
                <td>${user.role==1?"Admin":"Menber"}</td>
                <td>${user.gender}</td>
                <td><a href="edit-user.html?id=${user.id}" class="btn btn-sm btn-info">Edit</a>
                        <button type="button" class="btn btn-sm btn-danger btn-remove" onclick="DeleteRow(${user.id})">Remove</button></td>
                </tr>
                `
            }).join("");
            $('#list-user').innerHTML = result;
        })
    }
    getUser();
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
            let url = 'http://localhost:3000/user/' + id;
            fetch(url, {
                method: "DELETE"
            }).then(function(res) {
                return res.json(); // chuyển chuỗi nhận được thành đối tượng json
            }).then(function(data) {
                // các lệnh xử lý cho dữ liệu ở đây: các công việc hiển thị.
                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa',
                    showConfirmButton: false,
                    timer: 1500
                })
                // location.reload();
                load_user();
            });
        }
    })
    return false;
}
function load_user(){
    const API ="http://localhost:3000/user?_sort=id&_order=desc";
    const $ = document.querySelector.bind(document);
    fetch(API, {
        method: "GET"
    }).then(response => response.json())
    .then(data => {
        const result = data.map((user,index) =>{
            return `
            <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td><img src='${user.avatar}' width = "70"></td>
            <td>${user.role==1?"Admin":"Menber"}</td>
            <td>${user.gender}</td>
            <td><a href="edit-user.html" class="btn btn-sm btn-info">Edit</a>
                    <button type="button" class="btn btn-sm btn-danger btn-remove" onclick="DeleteRow(${user.id})">Remove</button></td>
            </tr>
            `
        }).join("");
        $('#list-user').innerHTML = result;
    })
}