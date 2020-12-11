//Slider anh detail
const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
let slide_pro = document.querySelector('.slides .pgwSlideshow');

//Slide ảnh sản phẩm
fetch("http://localhost:3000/gallery?product_id=" + id, {
    method: "GET"
}).then(response => response.json())
    .then(data => {
        let result = data.map(function (gall, index, arr) {
            return `<li><img src="${gall.images}" alt=""></li>`;
        }).join("");

        slide_pro.innerHTML = result;
    }).then(function () {
        $('.pgwSlideshow').pgwSlideshow({
            autoSlide: false,
            // adaptiveDuration : 5000,
            displayControls: false
        });
    });
//Hiển thị danh mục
function show_cate() {
    let depart_cate = document.querySelector('ul.depart-hover');
    let dropdown_cate = document.querySelector('ul.dropdown');
    let filter_cate = document.querySelector('.filter-catagories');

    fetch("http://localhost:3000/categories", {
        method: "GET"
    }).then(response => response.json())
        .then(data => {
            let result = data.map(function (cate, index, arr) {
                return ` <li><a href="list-product.html?id=${cate.id}">${cate.name}</a></li>`;
            }).join("");

            depart_cate.innerHTML = result;
            dropdown_cate.innerHTML = result;
            filter_cate.innerHTML = result;
        })
}
show_cate();
//Hàm hiển thị ten danh mục
function getCateName(id) {
    fetch("http://localhost:3000/categories/" + id, {
        method: "GET"
    }).then(res => res.json())
        .then(function (data) {
            return data.name;
        }).then(result => {
            let cate = document.querySelectorAll('.catagory-name');
            let pd_cate = document.querySelector('.pd-title span');
            pd_cate.innerHTML = result;
            cate.forEach(item => {
                item.innerHTML = result;
            })
        })
}

//sản phẩm liên quan
function relate_pro() {
    let relatePro = document.querySelector('.row.js-relate-pro');
    //cập nhật lượt xem
    fetch("http://localhost:3000/product/" + id, {
        method: "GET"
    }).then(response => response.json())
        .then(data => {
           let dataPost = {
                view: data.view + 1
            }
            fetch("http://localhost:3000/product/" + id, {
                method: 'PATCH', // sửa thì dùng phương thức PATCH
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataPost),
            })

            fetch("http://localhost:3000/product?cate_id=" + data.cate_id + "&id_ne=" + id+"&_sort=id&_order=desc&_start=0&_limit=4", {
                method: "GET"
            }).then(res => res.json())
                .then(data => {

                    let result = data.map(function (pro, index, arr) {
                        return `<div class="col-lg-3 col-sm-6 mb-3">
                                <div class="product-item">
                                    <div class="pi-pic">
                                       <a href="product.html?id=${pro.id}"> <img src="${pro.images}" alt="" height="262"></a>
                                       ${pro.sale > 0 ? "<div class='sale'>" + pro.sale * 100 + "%</div>" : ""}
                                    </div>
                                    <div class="pi-text">
                                        <div class="catagory-name"></div>
                                        <a href="product.html?id=${pro.id}">
                                            <h5>${pro.name}</h5>
                                        </a>
                                        <div class="product-price">
                                            ${new Intl.NumberFormat('de-DE').format(pro.price - (pro.price * pro.sale))}đ
                                            <span> ${pro.sale > 0 ? "<del>" + new Intl.NumberFormat('de-DE').format(pro.price) + "</del>đ" : ""}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                    }).join("");

                    relatePro.innerHTML = result;
                }).then(() => {
                    fetch("http://localhost:3000/product/" + id, {
                        method: "GET"
                    }).then(response => response.json())
                        .then(data => {
                            getCateName(data.cate_id)
                        })
                })
        })
}
relate_pro();
//Kiem tra co cart chua neu chua co thi gan cho no 1 mang 
if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", JSON.stringify([]))
}
//Gan gia tri cho bien cart

let addCart = document.querySelector('.pd-cart');
addCart.addEventListener('click', function () {
    var cart = JSON.parse(localStorage.cart);
    let getColorPro = document.querySelector('.color ul li.active input[checked="checked"]').value;
    let getQty = Number(document.querySelector('.pro-qty input').value);
    fetch("http://localhost:3000/product/" + id, {
        method: "GET"
    }).then(response => response.json())
        .then(data => {

            var obj = {
                id: data.id,
                images: data.images,
                name: data.name,
                color: getColorPro,
                price_new: data.price - (data.price * data.sale),
                qty: getQty
            }
            var flag = false;

            //kiểm tra sản phẩm có trong giỏ hàng chưa
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].id == obj.id && cart[i].color == obj.color) {
                    flag = true;
                    break;
                }
            }
            //San phẩm chưa có trong giỏ hàng
            if (!flag) {
                //Thêm vào trong giỏ
                cart.push(obj);
            } else {//Sản phẩm đã có trong giỏ hàng thi tang qty
                cart[i].qty += obj.qty;
            }
            //Luu vao localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
            checkCart();
            cartHover();

            Swal.fire({
                icon: 'success',
                title: 'Sản phẩm đã được thêm vào giỏ hàng',
                showConfirmButton: false,
                timer: 1500
            })
            // debugger;
        })
});
function checkCart() {
    let cart_hover = document.querySelector('.cart-icon .cart-hover');
    if (localStorage.getItem("cart") == null || localStorage.getItem("cart") == '[]') {
        cart_hover.innerHTML = `<div class="col-12 text-center">
        <img src="img/cart.png" width="100">
        <p class="mb-3">Chưa có sản phẩm trong giỏ hàng</p>
    </div>`;
    } else {
        cart_hover.innerHTML = `<div class="select-items">
        <table>
            <tbody>
            </tbody>
        </table>
    </div>
    <div class="select-total">
        <span>Tổng:</span>
        <h5>$120.00</h5>
    </div>
    <div class="select-button">
        <a href="shopping-cart.html" class="primary-btn view-card">Xem giỏ hàng</a>
        <a href="check-out.html" class="primary-btn checkout-btn">Thanh toán</a>
    </div>`;
    }
}
function cartHover() {
    let totalCartUnit = document.querySelector('.cart-icon .js-totalProCart');
    if (localStorage.getItem("cart") == null || localStorage.getItem("cart") == '[]') {
        let cart_hover = document.querySelector('.cart-icon .cart-hover');
        cart_hover.innerHTML = `<div class="col-12 text-center">
        <img src="img/cart.png" width="100">
        <p class="mb-3">Chưa có sản phẩm trong giỏ hàng</p>
    </div>`;
        totalCartUnit.innerText = "0";
    } else {
        let selectUnit = document.querySelector('.select-items table tbody');
        let selectTotal = document.querySelector('.cart-hover .select-total h5');
        var cart = JSON.parse(localStorage.cart);
        var cartUnit = ""
        var numberPro = 0;
        var money = 0;
        for (var i = 0; i < cart.length; i++) {
            money += cart[i].price_new * cart[i].qty;
            numberPro += cart[i].qty;
            cartUnit += `<tr>
                            <td class="si-pic"><img src="${cart[i].images}" width="70" alt=""></td>
                            <td class="si-text">
                                <div class="product-selected">
                                    <p>${new Intl.NumberFormat('de-DE').format(cart[i].price_new)}đ x ${cart[i].qty}</p>
                                    <h6>${cart[i].name}</h6>
                                    
                                </div>
                            </td>
                            <td><b class="rounded-circle mr-3 d-inline-block p-2" style="background:${cart[i].color}"></b></td>
                            <td class="si-close">
                                <button class="border-0 bg-transparent" onclick="removeUnit(${cart[i].id},'${cart[i].color}')"><i class="ti-close"></i></button>
                            </td>
                        </tr>`;
        }
        selectUnit.innerHTML = cartUnit;
        selectTotal.innerHTML = new Intl.NumberFormat('de-DE').format(money) + 'đ';
        totalCartUnit.innerHTML = numberPro;
    }
}
cartHover()
function removeUnit(id, color) {
    var cart = JSON.parse(localStorage.cart);
    //kiểm tra sản phẩm có trong giỏ hàng chưa
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == id && cart[i].color == color) {
            cart.splice(i, 1)
            break;
        }
    }
    //Luu vao localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    if (localStorage.getItem("cart") == null || localStorage.getItem("cart") == '[]') {
        let totalCartUnit = document.querySelector('.cart-icon .js-totalProCart');
        let cart_hover = document.querySelector('.cart-icon .cart-hover');
        cart_hover.innerHTML = `<div class="col-12 text-center">
        <img src="img/cart.png" width="100">
        <p class="mb-3">Chưa có sản phẩm trong giỏ hàng</p>
    </div>`;
        totalCartUnit.innerText = "0";
    } else {
        cartHover();
    }
}
function inpKeyword(e) {
    let sremain = document.querySelector('#countryList .sremain ul');
    sremain.style.display = "block";
    fetch("http://localhost:3000/product?name_like=" + e.value, {
        method: "GET"
    }).then(res => res.json())
        .then(data => {
            let result = data.map(function (pro, index, arr) {
                return `<li>
                            <a href="http://localhost:3000/frontend/product.html?id=${pro.id}">
                                <p> <img src="${pro.images}"></p>
                                <div>
                                    <h3>${pro.name}</h3>
                                    <p>${new Intl.NumberFormat('de-DE').format(pro.price - (pro.price * pro.sale))}đ
                                        <span> ${pro.sale > 0 ? "<del>" + new Intl.NumberFormat('de-DE').format(pro.price) + "</del>đ" : ""}</span> 
                                    </p>
                                </div>
                            </a>
                        </li>`;
            }).join("");
            sremain.innerHTML = result;
        })
}
//Thêm bình luận cho sp
function saveComment() {
    //1. Lấy dữ liệu 
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let fullname = document.querySelector("input[name=fullname]").value;
    let email = document.querySelector("input[name=email]").value;
    let rating = document.querySelector("input[name=rating]").value;
    let content = document.querySelector("textarea[name=content]").value;
    let created_at = new moment();
    //3. Gửi dữ liệu lên server
    // trước hết là tạo đối tượng để cài dữ liệu vào
    let dataPost = {
        name: fullname,
        email: email,
        pro_id: Number(id),
        content: content,
        rating: Number(rating),
        approve: 0,
        created_at: created_at
    };

    fetch("http://localhost:3000/comment_pro", {
        method: 'POST', // thêm mới thì dùng post
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPost), // chuyển dữ liệu object trên thành chuỗi json
    })
        .then((response) => response.json()) // chuyển kết quả trả về thành json object
        .then((data) => {
            //Thông báo
            document.querySelector("input[name=fullname]").value = "";
            document.querySelector("input[name=email]").value = "";
            document.querySelector("textarea[name=content]").value = "";
            document.querySelector("input[name=rating]").value = "";
            showComment();
        })
        .catch((error) => {
            console.error('Error:', error); // ghi log nếu xảy ra lỗi
        });
}

//Validate
let validator = new Validator(document.querySelector('#form-comment-pro'), function (err, res) {
    if (res === true) {
        saveComment();
    }
    return false;
}, {
    rules: {
        checkEmail: function (value) {
            return (/^[a-zA-Z0-9_\.\-]+@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,4}){1,2}$/).test(value);
        }
    },
    messages: {
        en: {
            required: {
                empty: 'Không được để trống',
                incorrect: 'Nhập sai thông tin'
            },
            minlength: {
                empty: 'Hãy nhập tối thiểu {0} ký tự',
                incorrect: 'Hãy nhập tối thiểu {0} ký tự'
            },
            checkEmail: {
                empty: 'Nhập email',
                incorrect: 'Địa chỉ email không đúng định dạng'
            }
        }
    }
});
//Hiển thị bình luận đã duyệt
function showComment() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let proComment = document.querySelector('.customer-review-option .js-comment-show');
    fetch("http://localhost:3000/comment_pro?_sort=id&_order=desc&approve=1&pro_id=" + id, {
        method: "GET"
    }).then(response => response.json())
        .then(data => {
            document.querySelector('.customer-review-option .js-total-com').innerHTML = `${data.length} Bình luận`;
            if (data.length >0) {
            document.querySelector('.product-details .pd-rating span').innerHTML = `(Có ${data.length} đánh giá)`;
            }else{
                document.querySelector('.product-details .pd-rating span').innerHTML = '(Chưa có đánh giá)';
            }
            let rate = 0;
            let result = data.map(function (com, index, arr) {
                rate += com.rating;
                let name = com.name.split(" ");
                let nameuser = name[0].charAt(0).concat(name[name.length - 1].charAt(0)).toUpperCase();
                return `
                <div class="co-item">
                <div class="avatar-pic">
                    <img src="https://dummyimage.com/40x40/bababa/4a4a4d.png&text=${nameuser}" alt="">
                </div>
                <div class="avatar-text">
                    <div class="rateit" data-rateit-value="${com.rating}" data-rateit-readonly="true"></div>
                    <h5>${com.name}<span>${moment(com.created_at).format('LLLL')}</span></h5>
                    <div class="at-reply">${com.content}</div>
                </div>
            </div>`;
            }).join("");
            proComment.innerHTML = result;
            $(function () { $('div.rateit, span.rateit').rateit(); });
            //tính đánh giá trung bình của sản phẩm
            var averageRating = Math.ceil(rate/data.length *10)/10;
            if(data.length==0){
                averageRating = 0;
            }
            let dataPost = {
                rating: averageRating
            };
            //Cập nhật lại rating cho sản phẩm
            fetch("http://localhost:3000/product/"+id, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataPost), // chuyển dữ liệu object trên thành chuỗi json
            })
                .then((response) => response.json()) // chuyển kết quả trả về thành json object
                .then((data) => {
                    $('.rateit').rateit('value', data.rating)
                  ;
                    $(function () { $('div.rateit, span.rateit').rateit(); });
                })
                .catch((error) => {
                    console.error('Error:', error); // ghi log nếu xảy ra lỗi
                });
        });
}
showComment()