-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: paineldb
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.24-MariaDB

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
-- Table structure for table `fila`
--

DROP TABLE IF EXISTS `fila`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fila` (
  `SenhaID` int(11) NOT NULL AUTO_INCREMENT,
  `NumeroSenha` varchar(5) DEFAULT NULL,
  `DataHoraEmissao` timestamp NULL DEFAULT current_timestamp(),
  `TipoServico` int(11) DEFAULT NULL,
  `StatusSenha` varchar(100) DEFAULT NULL,
  `ClienteID` varchar(100) DEFAULT NULL,
  `NomeCliente` varchar(100) DEFAULT NULL,
  `ContatoCliente` varchar(100) DEFAULT NULL,
  `Prioridade` int(11) DEFAULT NULL,
  `TempoEsperaEstimado` varchar(10) DEFAULT NULL,
  `GuicheAgente` varchar(5) DEFAULT NULL,
  `Comentarios` varchar(100) DEFAULT NULL,
  `UnidadeID` int(11) DEFAULT NULL,
  PRIMARY KEY (`SenhaID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fila`
--

LOCK TABLES `fila` WRITE;
/*!40000 ALTER TABLE `fila` DISABLE KEYS */;
INSERT INTO `fila` VALUES (1,'1','2023-09-13 09:40:05',1,'1','1','1',NULL,8,'15','2',NULL,1);
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

-- Dump completed on 2023-09-13  7:24:00
