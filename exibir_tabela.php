<?php
//config

$servidor = "localhost";
$usuario = "root";
$senha = "1234";
$banco_de_dados = "scores";

//estabelecendo uma conexão

$conexao = mysqli_connect($servidor, $usuario, $senha, $banco_de_dados);

if(!$conexao){
  die("<h2>fue fue<h2>" . mysqli_connect_error());
} 

$sql_command = "SELECT * FROM tabela";

$acao = mysqli_query($conexao, $sql_command);

echo "<table>";
echo "<td>Nome</td>";
echo "<td>Pontuacao</td>";

while ($linha = mysqli_fetch_assoc($acao))  {
    echo "<tr><td>". $linha["nome"] .
    "</td><td>". $linha["pontuacao"] .
    "</td><tr>";
}
echo "</table>";