"use strict"
const canvas = document.getElementById('game'); // Обращаемся к игровому полю из документа и записываем данные в константу
const context = canvas.getContext('2d'); // Делаем поле двухмерным
const grid = 10; // Размер игровой клетки
const paddleHeight = grid * 5; //   Высота ракетки
// Задаём максимальное расстояние, на которое могут двигаться ракетки
const LeftmaxPaddleY = canvas.height - grid - paddleHeight * 2;
const RightmaxPaddleY = canvas.height - grid - paddleHeight;
let paddleSpeed = 6; // Скорость ракетки
let ballSpeed = 3; // Скорость мяча
let record = 0; // Рекорд
let count = 0; // Набранные очки
let secret = false; // активация секретного уровня
let secret_count = 0; // число отбиваний в секретном режиме
let ballColor = '#ffffff'; // цвет мяча, на старте — белый
let Storage_size = sessionStorage.length; // Узнаём размер хранилища
if (Storage_size > 0) {
  record = sessionStorage.getItem('record'); // Достаём оттуда текущее значение рекорда
} else {
  sessionStorage.setItem('record', 0); // Делаем новую запись и кладём туда ноль — рекорда пока нет
}
// Описываем левую ракетку
const leftPaddle = {
  x: grid * 2, // Ставим её по центру
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid, // Ширина — одна клетка
  height: paddleHeight*2, // Высоту берём из константы
  dy: 0 // ракетка на старте никуда не движется
};
// Описываем правую ракетку
const rightPaddle = { // Ставим по центру с правой стороны
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  // Задаём такую же ширину и высоту
  width: grid,
  height: paddleHeight,
  dy: 0 // Правая ракетка тоже пока никуда не двигается
};
// Описываем мячик
const ball = {
  x: canvas.width / 2, // Он появляется в самом центре поля
  y: canvas.height / 2,
  width: grid, // квадратный, размером с клетку
  height: grid,
  resetting: false, // На старте мяч пока не забит, поэтому убираем признак того, что мяч нужно ввести в игру заново
  dx: ballSpeed, // Подаём мяч в правый верхний угол
  dy: -ballSpeed
};
// Проверка на то, пересекаются два объекта с известными координатами или нет
// Подробнее тут: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}
// Главный цикл игры
function loopGame() {
  requestAnimationFrame(loopGame); // Очищаем игровое поле
  context.clearRect(0, 0, canvas.width, canvas.height);
  leftPaddle.y += leftPaddle.dy; // Если ракетки на предыдущем шаге куда-то двигались — пусть продолжают двигаться
  rightPaddle.y += rightPaddle.dy;
  if (leftPaddle.y < grid) { // Если левая ракетка пытается вылезти за игровое поле вниз, то оставляем её на месте
    leftPaddle.y = grid;
  } else if (leftPaddle.y > LeftmaxPaddleY) { // Проверяем то же самое сверху
    leftPaddle.y = LeftmaxPaddleY;
  }
  if (rightPaddle.y < grid) { // Если правая ракетка пытается вылезти за игровое поле вниз,то оставляем её на месте
    rightPaddle.y = grid;
  }
  // Проверяем то же самое сверху
  else if (rightPaddle.y > RightmaxPaddleY) {
    rightPaddle.y = RightmaxPaddleY;
  }
  // Рисуем ракетки, каждая ракетка — прямоугольник
  context.fillStyle = 'white';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
  // Если мяч на предыдущем шаге куда-то двигался — пусть продолжает двигаться
  ball.x += ball.dx;
  ball.y += ball.dy;
  leftPaddle.dy = ball.dy; // пусть ракетка движется точно так же, как и мяч
  // Если мяч касается стены снизу — меняем направление по оси У на противоположное
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1;
  }
  // Делаем то же самое, если мяч касается стены сверху
  else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1;
  }
  // Если мяч улетел за игровое поле влево или вправо — перезапускаем его
  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    // Помечаем, что мяч перезапущен, чтобы не зациклиться
    ball.resetting = true;
    // Если игрок набрал больше рекорда — записываем это как новый рекорд
    if (count > record) {
      let record = count;
    };
    count = 0; // Обнуляем количество очков у игрока
    sessionStorage.setItem('record', record); // Кладём значение рекорда в хранилище браузера
    setTimeout(() => { // Даём 2 секунды  на подготовку игрокам и запускаем мяч из центра
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, 2000);
  }
  // Если мяч коснулся левой ракетки,
  if (collides(ball, leftPaddle)) {
    ball.dx *= -1; // то отправляем его в обратном направлении
    ball.x = leftPaddle.x + leftPaddle.width; // Увеличиваем координаты мяча на ширину ракетки, чтобы не засчитался новый отскок
  } else if (collides(ball, rightPaddle)) { // Проверяем и делаем то же самое для правой ракетки
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.width;
    count += 1; // считаем отскоки
    if (count >= 10) { // если набралось 10 — активируем секретный уровень
      secret = true
    };
    //  секретный уровень
    if (secret) {
      secret_count += 1; // увеличиваем новые отскоки
      if (secret_count % 3 == 0) { // если это число делится на 3 без остатка…
        if (ball.dx > 0) { // увеличиваем скорость мяча на единицу
          ball.dx += 1
        } else {
          ball.dx -= 1
        };
        if (ball.dy > 0) {
          ball.dy += 1
        } else {
          ball.dy -= 1
        };
        ballColor = '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase(); //  и красим мяч случайным образом
      }
    }
  }
  // Рисуем мяч нужным цветом
  context.fillStyle = ballColor;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);
  // Рисуем стены
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);
  for (let i = grid; i < canvas.height - grid; i += grid * 2) { // Рисуем сетку посередине
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
  // Отслеживаем нажатия клавиш
  document.addEventListener('keydown', function(event) { // Если нажата клавиша вверх,то двигаем правую ракетку вверх
    if (event.which === 38) {
      rightPaddle.dy = -paddleSpeed;
    } else if (event.which === 40) { // Если нажата клавиша вниз,то двигаем правую ракетку вниз
      rightPaddle.dy = paddleSpeed;
    }
  });
  // А теперь следим за тем, когда кто-то отпустит клавишу, чтобы остановить движение ракетки
  document.addEventListener('keyup', function(event) {
    if (event.which === 38 || event.which === 40) { // Если это стрелка вверх или вниз,
      rightPaddle.dy = 0; // останавливаем правую ракетку
    }
  });

  context.fillStyle = "#ff0000"; // Цвет текста
  context.font = "bold 20pt Courier"; // Задаём размер и шрифт
  context.fillText('Record: ' + record, 150, 550); // Сначала выводим рекорд
  context.fillText(count, 450, 550); // Затем — набранные очки
}
requestAnimationFrame(loopGame); // Запускаем игру