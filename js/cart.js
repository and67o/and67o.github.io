var cart = {};
function loadCart() {
	if (localStorage.getItem("cart")) { //проверяю есть ли в localStorage запись cart 
			cart = JSON.parse(localStorage.getItem("cart")); // и если есть ,то записываю в cart 
			showCart();
		}
	else {
		$('.cart__item').html("<p>The Cart is Empty!</p>");
	}
}

function showCart() {
	if (!isEmpty(cart)) {
		$(".cart__item").html("The Cart is Empty!");
	}

	else {
		$.getJSON('filter.json', function (data) {
			var goods = data;
			var out = '';
			var count=0;
			for (var id in cart) {
				out+='<div class="cart__item__list">';
					out +=`<img class="cart-img" src="../img/item/item_${data[id].number}.png" alt="">`;
					out+='<div class="description">';
						out += `<p class="description__total">Total: ${cart[id]*goods[id].cost}$</p>`;
						out += '<div class="description__article">';
							out += `<h2 class="article-name">${goods[id].name}</h2>`;
							out += '<ul class="article">';
								out += `<li class="article-cost">Cost: ${goods[id].cost}$</li>`;
								out += `<li class="article-color">Color: ${goods[id].color}</li>`;
								out += `<li class="article-size">Size: ${goods[id].size}</li>`;
							out+='</ul>';
						out+='</div>';
						out+='<div class="description__btn-count">';
							out += `<button data-id="${id}" class="btn del-goods">`;
								 out+='<img class="del-goods-img" src="img/delete-item.png" alt="">';
							out+='</button>';
							out += ` <button data-id="${id}" class="btn minus-goods">-</button> `
							out += ` <div class="count-item">${cart[id]}</div>`;
							out += ` <button data-id="${id}" class="btn plus-goods">+</button> `
						out+='</div>';
					out+='</div>';
				out+='</div>';
				count=count+cart[id]*goods[id].cost;
			}
			$('.cart__item').html(out);

			$('.total-value>span').html(count+"$");

			var finalCount=count+parseInt($(".shiping>span").html());
			
			$('.final-value>span').html(finalCount+"$");

			$('.del-goods').on('click', delGoods);

			$('.plus-goods').on('click',plusGoods);
			
			$('.minus-goods').on('click',minusGoods);
		});
	}
}

function delGoods() { //удалем полность товар
	var id = $(this).attr('data-id');
	delete cart[id];
	saveCart();
	showCart();
}

function minusGoods() { //уменьшаем кол-во товаров
	var id=$(this).attr('data-id'); //получаем айди товара  
	if (cart[id]==1){
		delete cart[id];
	}
	else{
		cart[id]--;
	}
	saveCart();
	showCart();
}

function plusGoods() { //добавляет кол-во товаров 
	var id=$(this).attr('data-id');
	cart[id]++;
	saveCart();
	showCart();
}

function saveCart() { 
	localStorage.setItem('cart', JSON.stringify(cart)); //сохраняем корщину в локарстораж и соххраняем ее в строке
}

function isEmpty(object) {//проверяем корзину на пустоту
	for (var key in object) 
	if (object.hasOwnProperty(key)) return true;
	return false;
}

$(document).ready(function () {
	loadCart();
});