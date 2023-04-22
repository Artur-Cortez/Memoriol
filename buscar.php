<?php
$host = 'localhost';
$usuario = 'root';
$senha = '1234';
$banco_de_dados = 'scores';

// Conexão com o banco de dados
$mysqli = new mysqli($host, $usuario, $senha, $banco_de_dados);
if ($mysqli->connect_errno) {
  die('Não foi possível conectar ao banco de dados: ' . $mysqli->connect_error);
}

// Verifica se a requisição é do tipo GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

  // Obtém os nomes e pontuações cadastrados na tabela
  $resultado = $mysqli->query('SELECT id, nome, pontuacao FROM nomes');
  if (!$resultado) {
    die('Não foi possível obter os nomes do banco de dados: ' . $mysqli->error);
  }

  // Cria um array com os nomes e pontuações cadastrados
  $registros = array();
  while ($row = $resultado->fetch_assoc()) {
    $registros[] = $row;
  }

  // Retorna os nomes e pontuações como uma resposta JSON
  header('Content-Type: application/json');
  echo json_encode($registros);
}

