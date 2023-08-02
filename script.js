const mouseEventToCoordinate = mouseEvent => {
  mouseEvent.preventDefault();
  return {x: mouseEvent.clientX, y: mouseEvent.clientY};
};

const touchEventToCoordinate = touchEvent => {
  touchEvent.preventDefault();
  return {x: touchEvent.changedTouches[0].clientX, y: touchEvent.changedTouches[0].clientY};
};

let target = document.querySelectorAll('.boxcontent');
let mouseDowns = Rx.Observable.fromEvent(target, "mousedown").map(mouseEventToCoordinate);
let mouseMoves = Rx.Observable.fromEvent(window, "mousemove").map(mouseEventToCoordinate);
let mouseUps = Rx.Observable.fromEvent(window, "mouseup").map(mouseEventToCoordinate);

let touchStarts = Rx.Observable.fromEvent(target, "touchstart").map(touchEventToCoordinate);
let touchMoves = Rx.Observable.fromEvent(target, "touchmove").map(touchEventToCoordinate);
let touchEnds = Rx.Observable.fromEvent(window, "touchend").map(touchEventToCoordinate);

let dragStarts = mouseDowns.merge(touchStarts);
let moves = mouseMoves.merge(touchMoves);
let dragEnds = mouseUps.merge(touchEnds);

let drags = dragStarts.concatMap(dragStartEvent => {
  return moves.takeUntil(dragEnds).map(dragEvent => {
    const x = dragEvent.x - dragStartEvent.x;
    const y = dragEvent.y - dragStartEvent.y;
    return {x, y};
  });
});

let ends = dragStarts.concatMap(dragStartEvent => {
  return dragEnds.first().map(dragEndEvent => {
    const x = dragEndEvent.x - dragStartEvent.x;
    const y = dragEndEvent.y - dragStartEvent.y;
    return {x, y};
  });
});

dragStarts.forEach(() => {
  $('.boxcontent').last().css({
    transition: 'initial',
    cursor: 'grabbing'
  });
  $('.like').last().css({
    transition: 'initial'
  });
  $('.nope').last().css({
    transition: 'initial'
  });
});

drags.forEach(coordinate => {
  $('.boxcontent').last().css({
    left: coordinate.x, 
    top: coordinate.y,
    transform: 'rotate('+(-coordinate.x/20)+'deg)'
  });
  $('.box:nth-last-of-type(2) .boxcontent').css({
    width: Math.min(100, 90 + Math.abs(coordinate.x)/200*10) +"%",
    height: Math.min(100, 90 + Math.abs(coordinate.x)/200*10) +"%",
    margin: Math.max(0, (1 - Math.abs(coordinate.x)/200)*5) + "%"
  });
  $('.like').last().css({
    opacity: coordinate.x/200
  });
  $('.nope').last().css({
    opacity: -coordinate.x/200
  });
});

ends.forEach((coordinate) => {
  const minSwipeLength = 130;
  if (coordinate.x > minSwipeLength) {
    like();
  } else if (coordinate.x < -minSwipeLength) {
    nope();
  } else {
    cancel();
  }
});

function like() {
  $('.box:last .boxcontent').css({
    transition: 'left 0.5s',
    left: 500
  });
  setTimeout(() => { 
    $('.box').last().remove();
  }, 500);
}

function nope() {
  $('.boxcontent').last().css({
    transition: 'left 0.5s',
    left: -500
  });
  setTimeout(() => { 
    $('.box').last().remove();
  }, 500);
}

function cancel() {
  const last = $('.box:last .boxcontent');
  last.css({
    transition: 'left 0.5s, top 0.5s, transform 0.5s',
    left: 0, 
    top: 0,
    transform: 'rotate(0deg)'
  });
  last.find('.like').css({
    transition: 'opacity 0.5s',
    opacity: 0
  });
  last.find('.nope').css({
    transition: 'opacity 0.5s',
    opacity: 0
  });
}



// Функция свайпа с помощью кнопок

  // The rest of your code remains unchanged

  // Rename one of the 'like()' functions to 'swipeRight()'
function swipeRight() {
  $('.box:last .boxcontent').addClass('animate-like');
  $('.like').last().css({
    opacity: 1
  });
  setTimeout(() => {
    $('.box').last().remove();
  }, 300);
}

function swipeLeft() {
  $('.box:last .boxcontent').addClass('animate-nope');
  $('.nope').last().css({
    opacity: 1
  });
  setTimeout(() => {
    $('.box').last().remove();
  }, 300);
}

$('#like-button').on('click', swipeRight);
$('#nope-button').on('click', swipeLeft);

  // The rest of your code remains unchanged

  // Закрытие модального окна по щелчку в любой области
  var modals = document.getElementsByClassName("overlay");

  // Добавляем обработчик события клика для каждого модального окна
  Array.from(modals).forEach(function (modal) {
    modal.addEventListener("click", function (event) {
      // Проверяем, является ли цель клика модальным окном
      if (event.target === modal) {
        // Закрываем модальное окно
        modal.style.display = "none";
      }
    });
  });

  // Получаем ссылки или кнопки, открывающие модальные окна
  var modalLinks = document.querySelectorAll(".button[href^='#popup']");

  // Добавляем обработчик события клика для каждой ссылки или кнопки
  Array.from(modalLinks).forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));
      target.style.display = "block";
    });
  });

  // Reset
  const svgElement = document.getElementById("custom-swipe-horizontal");
  let touchStartX = 0;
  let touchEndX = 0;

  function hideObject() {
    svgElement.classList.add("hide");
    setTimeout(() => {
      svgElement.style.display = "none";
    }, 300);
  }

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 1) {
      hideObject();
    }
  }

  svgElement.addEventListener("click", hideObject);
  svgElement.addEventListener("touchstart", handleTouchStart);
  svgElement.addEventListener("touchmove", handleTouchMove);
  svgElement.addEventListener("touchend", handleTouchEnd);

  setTimeout(hideObject, 4000);


// Закрытие модального окна по щелчку в любой области

 var modals = document.getElementsByClassName("overlay");

  // Добавляем обработчик события клика для каждого модального окна
  Array.from(modals).forEach(function(modal) {
    modal.addEventListener("click", function(event) {
      // Проверяем, является ли цель клика модальным окном
      if (event.target === modal) {
        // Закрываем модальное окно
        modal.style.display = "none";
      }
    });
  });


// Получаем ссылки или кнопки, открывающие модальные окна
var modalLinks = document.querySelectorAll(".button[href^='#popup']");

// Добавляем обработчик события клика для каждой ссылки или кнопки
Array.from(modalLinks).forEach(function(link) {
  link.addEventListener("click", function(event) {
    var target = document.querySelector(link.getAttribute("href"));
    target.style.display = "block";
  });
});



// Пульс фото

var size = 70;
setInterval(function(){
  $('.pulse').width(size).height(size);
  size++;
  if(size > 100){
    $('.pulse').css('opacity', $('.pulse').css('opacity')-0.001);
  }
  if(size > 500){
    size = 50;
	$('.pulse').width(size).height(size);
    $('.pulse').css('opacity', '0.3');
  }
},0); 

$('.photo').click(function(){
  console.log('CLick'); 
  $( ".pulse" ).clone().appendTo( "body" );
})