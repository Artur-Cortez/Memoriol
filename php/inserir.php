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

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Obtém o valor do campo "nome" do formulário
  if (isset($_POST['nome']) && !empty($_POST['nome'])) {
    $nome = $_POST['nome'];
    $pontuacao = $_POST['pontuacao'];

    // Prepara uma consulta SQL para inserir o novo nome na tabela
    $consulta = $mysqli->prepare('INSERT INTO nomes (nome, pontuacao) VALUES (?, ?)');
    $consulta->bind_param('si', $nome, $pontuacao);

    // Executa a consulta SQL e verifica se houve algum erro
    if (!$consulta->execute()) {
      die('Não foi possível inserir o nome no banco de dados: ' . $mysqli->error);
    } else {
      echo "Inserção feita com sucesso";
    }

    // Obtém os nomes cadastrados na tabela
    $resultado = $mysqli->query('SELECT * FROM nomes');
    if (!$resultado) {
      die('Não foi possível obter os dados do banco de dados: ' . $mysqli->error);
    } else {
      echo "dados obtidos com sucesso";
    }

    // Cria um array com os nomes cadastrados
    $registros = array();
    while ($row = $resultado->fetch_assoc()) {
      $registros[] = $row;
    }

    // Retorna os nomes como uma resposta JSON
    header('Content-Type: application/json');
    echo json_encode($registros);
  } else {
    die('O campo "nome" é obrigatório.');
  }
}
