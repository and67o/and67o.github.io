//---------Variables------------
var slideNow = 1;
var slideCount = $('#slidewrapper').children().length;
var translateWidth = 0;
var slideInterval = 3000;
var cart={};

function init() { // получаем goods.json
	$.getJSON("filter.json" ,goodsOut);
}

function goodsOut(data) { //ввыводим наши блоки
	var out='';
	console.log(data);
	for (var key in data){///cоздаение блоков товаров
		out+=`<div  class="magazine__item__list bounceInLeft animated"  id="mgLst-${data[key].number}" >`;
			out+='<div id="img-item" class="img-item">';
				out +=`<img src="../img/item/item_${data[key].number}.png" alt="picture with item">`;
			out+='</div>';
			out+='<div class="information">';
				out+='<div class="name-cost">';
					out+=`<p class="name">${data[key].name}</p>`;
					out+=`<div class="cost">$${data[key].cost}.00</div>`;
				out+='</div>';
				out+='<div class="to-cart">';
					out+=`<button  class="add-to-cart btn" data-id="${key}"></button>`;
					out+=`<p class="text-to-cart" data-id="${key}">Add to Cart</p>`;
				out+='</div>';
				out+='</div>';
			out+='</div>';
	}

	$('#magazine__item').html(out); //выодим блоки на страницу

	var itemCount=$(".magazine__item").children().length;

	for (var i=0; i<=itemCount;i++){
		if ($(window).width()>1000){ //расположеине изображения зависит от разрешения экрана
			$("#mgLst-"+i).css("background","url(../img/item/item_"+i+"-hover.png) 50% 20% no-repeat, url(../img/item/bg_item.png)");
		} else {
			$(".to-cart").css("margin-right","0px");
			$("#mgLst-"+i).css("background","url(../img/item/item_"+i+"-hover.png) 50% 64% no-repeat, url(../img/item/bg_item.png)");
		}
	}

	$(function() {
		$(".img-item").hover(
			function(){$(this).find("img").stop().animate({ left:-335}, 500);  },
			function(){$(this).find("img").stop().animate({  left:0 }, 500);  }
		);
	});

	$(".add-to-cart").on('click', addToCart);
	$(".text-to-cart").on('click', addToCart);
}
$("#img-cart").on('click',function(){ $('.mini-cart').slideToggle("slow"); });

$("#img-cart-mobile").on('click',function(){ $('.mini-cart').slideToggle("slow"); });

$("#link-magazine").on("click","a", navbarNavigation);

$("#link-about").on("click","a", navbarNavigation);

$("#link-magazine-footer").on("click","a", navbarNavigation);

$("#link-about-footer").on("click","a", navbarNavigation);

$("#close-mini-cart").on("click", function (event) {
	event.preventDefault();
	$('#mini-cart').toggle("slow");
})

$("#mobile-menu").on("click", function () {$('.navbar').slideToggle("slow");})

$("#btn-mobile-filtr").on("click", function () {
	$("#btn-switch").text($("#magazine__sort").is(':visible')? '>>': '<<');
	$(".name").toggle();
	$('#magazine__sort').toggle();
})

$('#btn-next').on("click", nextSlide);

$('#btn-prev').on("click", nextSlide);


function navbarNavigation(event) {
	event.preventDefault();
	var id  = $(this).attr('href'),
	top = $(id).offset().top;
	$('body,html').animate({scrollTop: top}, 2500);
}

function init_filtr() {
	$.getJSON("filter.json" ,filterGoods);
}

function filterGoods(data) {
	$( "#magazine__sort" ).click(function( event ) {// добавляем стили для более красивого отображения товаров 
		var countVisibleItem=$(".magazine__item__list:visible").length;
		if (countVisibleItem % 2 == 0 || countVisibleItem==1 ){
			$(".magazine__item__list").addClass("add-height").removeClass("add-flex");
		} else {
			$(".magazine__item__list").addClass("add-flex").removeClass("add-height");
		}
	});
	$("#magazine a" ).click(function( event ) {
		event.preventDefault();
		for (var key in data){
			var filterName=$(event.target).html();
			$("#mgLst-"+data[key].number).show();
			if (filterName!==data[key].categories && (filterName!==data[key].size) && (filterName!==data[key].brands)){
				$("#mgLst-"+key).hide();
			}
			if(filterName=="All products"){
				$("#mgLst-"+key).show();
			}
		}
	});
	$('.btn-color').on("click", function () {
		for (var key in data){
			var color=$(this).data("color");
			function clickColor(colorBtn) {
				if (color!==data[key].color){
					$("#mgLst-"+key).hide();
				} 
				else{
					$("#mgLst-"+key).show();
				}
			}
			clickColor("white");
			clickColor("red");
			clickColor("blue")
			clickColor("green");
			clickColor("black");
		}
	});
	//------------------------Vue.js----------------
	var app = new Vue({
		el: '#price',
			data: {
				value: 0
			},
		computed: {
			total: function () {
				return this.value
			}
		}
	});
	$('#btn-filter').on('click', function () {
		for (var key in data){
			var price_fl=+$('.price__value').html();
			if (price_fl<data[key].cost){
				$("#mgLst-"+key).hide("slow");
			}
		}
	});
}

function addToCart() {
	$(this).toggleClass('rubberBand animated');
	$(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
		$(e.target).removeClass('rubberBand animated');
	});
	var id = $(this).attr('data-id');
	if (cart[id]==undefined) {
		cart[id] = 1; //если в корзине ничего нет ,то делаем равным 1
	}
	else {
		cart[id]++; //иначе увеличиваем
	}
	showMiniCart();
	saveCart();
}

function saveCart() {
	localStorage.setItem('cart', JSON.stringify(cart));
}

function showMiniCart(data) {
	var out ="";
	var sum = 0;
	for (var key in cart) {
		sum = sum + cart[key];
	}
	out += sum;
	$('.place-to-sum').html(out);
}

function loadCart() {
	if (localStorage.getItem('cart')) {
		cart = JSON.parse(localStorage.getItem('cart'));
		showMiniCart();
	}
}

function nextSlide() {
	if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
		$('#slidewrapper').css('transform', 'translate(0, 0)');
		slideNow = 1;
	} else {
		translateWidth = -$('.header').width() * (slideNow);
		$('#slidewrapper').css({
		'transform': 'translate(' + translateWidth + 'px, 0)',
		'-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
		'-ms-transform': 'translate(' + translateWidth + 'px, 0)',
		});
		slideNow++;
	}
}

function prevSlide() {
	if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
		translateWidth = -$('.header').width() * (slideCount - 1);
		$('#slidewrapper').css({
			'transform': 'translate(' + translateWidth + 'px, 0)',
			'-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
			'-ms-transform': 'translate(' + translateWidth + 'px, 0)',
		});
		slideNow = slideCount;
	} else {
		translateWidth = -$('.header').width() * (slideNow - 2);
		$('#slidewrapper').css({
			'transform': 'translate(' + translateWidth + 'px, 0)',
			'-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
			'-ms-transform': 'translate(' + translateWidth + 'px, 0)',
		});
		slideNow--;
	}
}

$(document).ready(function () {
	var switchInterval = setInterval(nextSlide, slideInterval);
	$('.header').hover(
		function(){ clearInterval(switchInterval);},
		function(){ switchInterval = setInterval(nextSlide, slideInterval);}
	);
	init_filtr();
	init();
	loadCart();
});
