-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: paineldb
-- ------------------------------------------------------
-- Server version	5.5.5-10.6.7-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cargopermissao`
--

DROP TABLE IF EXISTS `cargopermissao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargopermissao` (
  `CargoID` int(11) NOT NULL,
  `PermissaoID` int(11) NOT NULL,
  PRIMARY KEY (`CargoID`,`PermissaoID`),
  KEY `PermissaoID` (`PermissaoID`),
  CONSTRAINT `cargopermissao_ibfk_1` FOREIGN KEY (`CargoID`) REFERENCES `cargos` (`CargoID`),
  CONSTRAINT `cargopermissao_ibfk_2` FOREIGN KEY (`PermissaoID`) REFERENCES `permissoes` (`PermissaoID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargopermissao`
--

LOCK TABLES `cargopermissao` WRITE;
/*!40000 ALTER TABLE `cargopermissao` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargopermissao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargos`
--

DROP TABLE IF EXISTS `cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargos` (
  `CargoID` int(11) NOT NULL AUTO_INCREMENT,
  `NomeCargo` varchar(100) NOT NULL,
  `DescricaoCargo` text DEFAULT NULL,
  PRIMARY KEY (`CargoID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargos`
--

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fila`
--

DROP TABLE IF EXISTS `fila`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fila` (
  `SenhaID` int(11) NOT NULL AUTO_INCREMENT,
  `NumeroSenha` int(11) DEFAULT NULL,
  `DataHoraEmissao` timestamp NULL DEFAULT current_timestamp(),
  `TipoServico` int(11) DEFAULT NULL,
  `StatusSenha` varchar(100) DEFAULT NULL,
  `ClienteID` varchar(100) DEFAULT NULL,
  `NomeCliente` varchar(100) DEFAULT NULL,
  `NumeroDocumento` int(11) DEFAULT NULL,
  `ContatoCliente` varchar(100) DEFAULT NULL,
  `Prioridade` int(11) DEFAULT NULL,
  `TempoEsperaEstimado` varchar(10) DEFAULT NULL,
  `GuicheAgente` varchar(5) DEFAULT NULL,
  `Comentarios` varchar(100) DEFAULT NULL,
  `UnidadeID` int(11) DEFAULT NULL,
  PRIMARY KEY (`SenhaID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fila`
--

LOCK TABLES `fila` WRITE;
/*!40000 ALTER TABLE `fila` DISABLE KEYS */;
INSERT INTO `fila` VALUES (5,1,'2023-09-13 14:47:16',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(6,2,'2023-09-13 14:47:25',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(7,3,'2023-09-13 16:03:45',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(8,1,'2023-09-13 16:04:18',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,2),(9,2,'2023-09-13 16:12:35',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,2),(10,3,'2023-09-13 16:12:41',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,2),(11,4,'2023-09-13 16:12:42',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,2),(12,5,'2023-09-13 16:12:43',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,2),(13,1,'2023-09-13 16:13:01',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,3),(14,2,'2023-09-13 16:13:05',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,3),(15,3,'2023-09-13 16:13:07',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,3),(16,4,'2023-09-13 16:13:09',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,3),(17,5,'2023-09-13 16:13:11',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,3),(18,4,'2023-09-13 16:14:02',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(19,5,'2023-09-13 16:14:17',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(20,6,'2023-09-13 16:28:31',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(21,7,'2023-09-13 16:28:36',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(22,8,'2023-09-13 16:28:40',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1),(23,9,'2023-09-13 16:29:13',1,'aguardando','1','default',NULL,NULL,8,'1','0',NULL,1);
/*!40000 ALTER TABLE `fila` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historicoatendimento`
--

DROP TABLE IF EXISTS `historicoatendimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historicoatendimento` (
  `AtendimentoID` int(11) NOT NULL AUTO_INCREMENT,
  `SenhaID` int(11) DEFAULT NULL,
  `DataHoraInicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `DataHoraFim` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `AtendenteID` int(11) DEFAULT NULL,
  `ServicoID` int(11) DEFAULT NULL,
  `ClienteID` int(11) DEFAULT NULL,
  `Status` enum('Concluído','Cancelado','Outro') NOT NULL,
  `Comentarios` varchar(255) DEFAULT NULL,
  `Prioridade` int(11) DEFAULT NULL,
  `TempoAtendimento` int(11) DEFAULT NULL,
  `MotivoAtendimento` varchar(255) DEFAULT NULL,
  `NotaAtendimento` int(11) DEFAULT NULL,
  `FeedbackCliente` varchar(255) DEFAULT NULL,
  `ObservacoesAtendimento` text DEFAULT NULL,
  PRIMARY KEY (`AtendimentoID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historicoatendimento`
--

LOCK TABLES `historicoatendimento` WRITE;
/*!40000 ALTER TABLE `historicoatendimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `historicoatendimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locaisatendimento`
--

DROP TABLE IF EXISTS `locaisatendimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locaisatendimento` (
  `LocalID` int(11) NOT NULL AUTO_INCREMENT,
  `NomeLocal` varchar(100) NOT NULL,
  PRIMARY KEY (`LocalID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locaisatendimento`
--

LOCK TABLES `locaisatendimento` WRITE;
/*!40000 ALTER TABLE `locaisatendimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `locaisatendimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissoes`
--

DROP TABLE IF EXISTS `permissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissoes` (
  `PermissaoID` int(11) NOT NULL AUTO_INCREMENT,
  `NomePermissao` varchar(100) NOT NULL,
  `DescricaoPermissao` text DEFAULT NULL,
  PRIMARY KEY (`PermissaoID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissoes`
--

LOCK TABLES `permissoes` WRITE;
/*!40000 ALTER TABLE `permissoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicos`
--

DROP TABLE IF EXISTS `servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicos` (
  `ServicoID` int(11) NOT NULL AUTO_INCREMENT,
  `NomeServico` varchar(100) NOT NULL,
  `Sigla` varchar(10) NOT NULL,
  `Status` enum('Ativo','Desativado') NOT NULL,
  PRIMARY KEY (`ServicoID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicos`
--

LOCK TABLES `servicos` WRITE;
/*!40000 ALTER TABLE `servicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokensapi`
--

DROP TABLE IF EXISTS `tokensapi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokensapi` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ClientID` varchar(255) NOT NULL,
  `ClientSecret` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokensapi`
--

LOCK TABLES `tokensapi` WRITE;
/*!40000 ALTER TABLE `tokensapi` DISABLE KEYS */;
INSERT INTO `tokensapi` VALUES (1,'1','1');
/*!40000 ALTER TABLE `tokensapi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidades`
--

DROP TABLE IF EXISTS `unidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidades` (
  `UnidadeID` int(11) NOT NULL AUTO_INCREMENT,
  `NomeUnidade` varchar(100) NOT NULL,
  `Endereco` varchar(255) DEFAULT NULL,
  `NumeroTelefone` varchar(15) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UnidadeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades`
--

LOCK TABLES `unidades` WRITE;
/*!40000 ALTER TABLE `unidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `unidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidadeservico`
--

DROP TABLE IF EXISTS `unidadeservico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidadeservico` (
  `UnidadeServicoID` int(11) NOT NULL AUTO_INCREMENT,
  `UnidadeID` int(11) DEFAULT NULL,
  `ServicoID` int(11) DEFAULT NULL,
  `LocalAtendimentoID` int(11) DEFAULT NULL,
  `Status` enum('Ativo','Desativado') NOT NULL,
  PRIMARY KEY (`UnidadeServicoID`),
  KEY `UnidadeID` (`UnidadeID`),
  KEY `ServicoID` (`ServicoID`),
  KEY `LocalAtendimentoID` (`LocalAtendimentoID`),
  CONSTRAINT `unidadeservico_ibfk_1` FOREIGN KEY (`UnidadeID`) REFERENCES `unidades` (`UnidadeID`),
  CONSTRAINT `unidadeservico_ibfk_2` FOREIGN KEY (`ServicoID`) REFERENCES `servicos` (`ServicoID`),
  CONSTRAINT `unidadeservico_ibfk_3` FOREIGN KEY (`LocalAtendimentoID`) REFERENCES `locaisatendimento` (`LocalID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidadeservico`
--

LOCK TABLES `unidadeservico` WRITE;
/*!40000 ALTER TABLE `unidadeservico` DISABLE KEYS */;
/*!40000 ALTER TABLE `unidadeservico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `UsuarioID` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(100) NOT NULL,
  `Sobrenome` varchar(100) NOT NULL,
  `NomeUsuario` varchar(50) NOT NULL,
  `Senha` varchar(255) NOT NULL,
  `Cargo` enum('Atendente','Supervisor','Admin') NOT NULL,
  `UserApiId` varchar(50) NOT NULL,
  `UserApiSecret` varchar(255) NOT NULL,
  `Status` enum('Ativo','Inativo') NOT NULL,
  `DataCadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UsuarioID`),
  UNIQUE KEY `NomeUsuario` (`NomeUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin ','Painel','admin','1','Admin','123456','123456','Ativo','2023-09-13 13:35:39');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarioservico`
--

DROP TABLE IF EXISTS `usuarioservico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarioservico` (
  `UsuarioServicoID` int(11) NOT NULL AUTO_INCREMENT,
  `UsuarioID` int(11) DEFAULT NULL,
  `ServicoID` int(11) DEFAULT NULL,
  PRIMARY KEY (`UsuarioServicoID`),
  KEY `UsuarioID` (`UsuarioID`),
  KEY `ServicoID` (`ServicoID`),
  CONSTRAINT `usuarioservico_ibfk_1` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`),
  CONSTRAINT `usuarioservico_ibfk_2` FOREIGN KEY (`ServicoID`) REFERENCES `servicos` (`ServicoID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarioservico`
--

LOCK TABLES `usuarioservico` WRITE;
/*!40000 ALTER TABLE `usuarioservico` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarioservico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuariounidade`
--

DROP TABLE IF EXISTS `usuariounidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuariounidade` (
  `UsuarioUnidadeID` int(11) NOT NULL AUTO_INCREMENT,
  `UsuarioID` int(11) DEFAULT NULL,
  `UnidadeID` int(11) DEFAULT NULL,
  PRIMARY KEY (`UsuarioUnidadeID`),
  KEY `UsuarioID` (`UsuarioID`),
  KEY `UnidadeID` (`UnidadeID`),
  CONSTRAINT `usuariounidade_ibfk_1` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`),
  CONSTRAINT `usuariounidade_ibfk_2` FOREIGN KEY (`UnidadeID`) REFERENCES `unidades` (`UnidadeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuariounidade`
--

LOCK TABLES `usuariounidade` WRITE;
/*!40000 ALTER TABLE `usuariounidade` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuariounidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'paineldb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-13 13:30:16
