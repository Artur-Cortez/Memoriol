<?php
// Verifica se os dados foram enviados via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recupera os valores enviados pelo formulário
    $nome = $_POST["input_usuario"] ?? "";
    $pontuacao = $_POST["pontuacao"] ?? "";

    // Verifica se os valores são válidos
    if (!empty($nome) && is_numeric($pontuacao)) {

        // Converte a pontuação para um número inteiro
        $pontuacao = intval($pontuacao);

        // Configuração do banco de dados
        $servidor = "localhost";
        $usuario = "root";
        $senha = "1234";
        $banco_de_dados = "scores";

        // Estabelece uma conexão com o banco de dados
        $conexao = mysqli_connect($servidor, $usuario, $senha, $banco_de_dados);

        // Verifica se a conexão foi estabelecida corretamente
        if (!$conexao) {
            die("<h2>fue fue<h2>" . mysqli_connect_error());
        } else {
            echo "Conexão sucedida <br>";
        }

        // Monta o comando SQL para inserir os dados na tabela
        $sql_command = "INSERT INTO tabela (id, nome, pontuacao)
            VALUES (NULL, '$nome', $pontuacao)";

        // Executa o comando SQL
        if (mysqli_query($conexao, $sql_command)) {
            $ultimo_id = mysqli_insert_id($conexao);
            echo "Comando SQL ok. Último id: " . $ultimo_id . "<hr>";
        } else {
            echo "Erro ao executar o comando SQL: " . mysqli_error($conexao);
        }

        // Fecha a conexão com o banco de dados
        mysqli_close($conexao);

    } else {
        echo "Valores inválidos";
    }

}
?>