<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ping_pong</title>
  <style>
    html,
    body {
      height: 100%;
      margin: 0;
    }
    body {
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    canvas {
      background: #2E8B57;
      display: block;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <!-- Рисуем игровое поле -->
  <canvas width="750" height="585" id="game"></canvas>
<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
 <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="<sha3></sha3-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
 <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="<sha3></sha3-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
 <script src="script.js"></script>
</body>
</html>
