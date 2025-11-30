-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: GraceNet
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `cpf` varchar(14) NOT NULL,
  `nome_completo` varchar(255) NOT NULL,
  `data_nascimento` date NOT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cep` varchar(9) NOT NULL,
  `rua` varchar(100) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `nome_rede` varchar(50) NOT NULL,
  `senha_rede` varchar(100) NOT NULL,
  `senha_portal` varchar(255) DEFAULT NULL,
  `plano` varchar(50) NOT NULL,
  `vencimento` enum('10','20','30') NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT (1),
  `id_plano` int DEFAULT NULL,
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `rg` (`rg`),
  KEY `cliente_plano` (`id_plano`),
  CONSTRAINT `cliente_plano` FOREIGN KEY (`id_plano`) REFERENCES `planos` (`id_plano`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'123.456.789-00','barata games','1990-05-20','12.345.678-9','(11) 98765-4321','joao.silva@example.com','01001-000','Avenida Paulista','1234','','',NULL,'Fibra 300MB','20',1,NULL,NULL,NULL),(2,'123.456.789-44','Jorge Alexandre dos Santos Filho','1990-05-20','12.345.678-7','(11) 98765-4388','jorge.silva@gmail.com','01401-000','Paulista','16','','',NULL,'Fibra 600MB','10',0,NULL,NULL,NULL),(4,'123.456.789-88','katia h','1996-01-26','','(11) 98765-4321','jorgedbl309@gmail.com','','','','','',NULL,'Fibra 300MB','10',1,NULL,NULL,NULL),(6,'123.466.789-88','jorginho ','2000-04-21','2345678','(11) 98765-4321','jorgealexandrefilho@proton.me','','','','','',NULL,'Fibra 300MB','10',1,NULL,NULL,NULL),(13,'443.466.789-88','ella','2000-04-21','1234567','(11) 98765-4321','ellafreya@gmail.com','','','','','',NULL,'Fibra 300MB','10',1,NULL,NULL,NULL),(15,'666.456.789-88','thiago','1999-08-21','3456789','(11) 98765-6666','jorgerpd12@gmail.com','','','','','',NULL,'Fibra 300MB','10',1,NULL,NULL,NULL),(16,'666.666.769-88','val','2000-11-02','12345678','(11) 98666-6677','jorgeRPD12@gmail.com','','','','','',NULL,'premium 2','10',1,NULL,NULL,NULL),(18,'123.456.789-54','asdfghjk','2006-07-11','9876543','81998248377','gdy3gdyw3gd@email.com','','','','','',NULL,'Fibra 300MB','10',1,NULL,NULL,NULL),(19,'704.490.150-68','sdfghjkl├º','1995-12-31','98765411','81998248326','asdfghjk@gmail.com','53419195','wertyui','12','A Configurar','mudar123','$2b$10$qRxwKARr1Mds6QiDHvP.4.ItjzIRliDNHqzvDJ8TZjG3byPxd1pMW','Ultra 1 GIGA','10',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cliente_insert` AFTER INSERT ON `clientes` FOR EACH ROW BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'clientes',
        NEW.id_cliente,
        'INSER├ç├âO',
        CONCAT('Novo cliente cadastrado: ', NEW.nome_completo, ' | CPF: ', NEW.cpf),
        CURRENT_USER()
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cliente_update` AFTER UPDATE ON `clientes` FOR EACH ROW BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'clientes',
        NEW.id_cliente,
        'ATUALIZA├ç├âO',
        CONCAT('Cliente atualizado: ', OLD.nome_completo, ' ÔåÆ ', NEW.nome_completo, ' | Status: ', OLD.status, ' ÔåÆ ', NEW.status),
        CURRENT_USER()
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cliente_delete` AFTER DELETE ON `clientes` FOR EACH ROW BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'clientes',
        OLD.id_cliente,
        'EXCLUS├âO',
        CONCAT('Cliente removido: ', OLD.nome_completo, ' | CPF: ', OLD.cpf),
        CURRENT_USER()
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `equipamentos`
--

DROP TABLE IF EXISTS `equipamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipamentos` (
  `id_equipamento` bigint NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `fabricante` varchar(100) DEFAULT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `mac_adress` varchar(17) DEFAULT NULL,
  `ip_gerenciado` varchar(45) DEFAULT NULL,
  `firmware` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `localizacao` varchar(100) NOT NULL,
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_equipamento`),
  UNIQUE KEY `numero_serie` (`numero_serie`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipamentos`
--

LOCK TABLES `equipamentos` WRITE;
/*!40000 ALTER TABLE `equipamentos` DISABLE KEYS */;
INSERT INTO `equipamentos` VALUES (1,'Roteador','TP-Link AC1750','','ABC12345','','','','Dispon├¡vel','Rack principal','2025-10-22 22:46:44'),(2,'ONT','HG8245H','Huawei','HWTC12345678','AA:BB:CC:11:22:33','192.168.1.100','V3R018C10S105','Defeito','Estoque Central','2025-10-26 16:47:25'),(4,'ONT','HG8245H','Huawei','HWTC12345666','AA:BB:CC:11:22:33','192.168.1.100','V3R018C10S105','Defeito','Estoque Central','2025-10-26 16:48:01');
/*!40000 ALTER TABLE `equipamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `tabela_afetada` varchar(100) NOT NULL,
  `id_registro_afetado` bigint DEFAULT NULL,
  `tipo_acao` enum('INSER├ç├âO','ATUALIZA├ç├âO','EXCLUS├âO') NOT NULL,
  `descricao_acao` text,
  `usuario_responsavel` varchar(100) DEFAULT NULL,
  `data_acao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (1,'clientes',3,'ATUALIZA├ç├âO','Cliente atualizado: katia alexandre ÔåÆ Jo├úo da Silva Neto | Status: 0 ÔåÆ 1','root@localhost','2025-10-22 22:37:23'),(2,'clientes',3,'ATUALIZA├ç├âO','Cliente atualizado: Jo├úo da Silva Neto ÔåÆ Jo├úo da Silva Neto | Status: 1 ÔåÆ 0','root@localhost','2025-10-22 22:37:28'),(3,'clientes',3,'EXCLUS├âO','Cliente removido: Jo├úo da Silva Neto | CPF: 443.456.789-44','root@localhost','2025-10-22 22:40:57'),(4,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: Jo├úo da Silva ÔåÆ Jo├úo da Silva | Status: 1 ÔåÆ 0','root@localhost','2025-10-26 15:01:15'),(5,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: Jo├úo da Silva ÔåÆ Jo├úo da Silva | Status: 0 ÔåÆ 1','root@localhost','2025-10-26 15:03:09'),(6,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: Jo├úo da Silva ÔåÆ Jo├úo da Silva | Status: 1 ÔåÆ 0','root@localhost','2025-10-26 15:03:14'),(7,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: Jo├úo da Silva ÔåÆ Jo├úo da Silva | Status: 0 ÔåÆ 1','root@localhost','2025-10-26 15:03:17'),(8,'clientes',4,'INSER├ç├âO','Novo cliente cadastrado: katia h | CPF: 123.456.789-88','root@localhost','2025-10-26 15:03:39'),(9,'clientes',6,'INSER├ç├âO','Novo cliente cadastrado: jorginho  | CPF: 123.466.789-88','root@localhost','2025-10-26 15:07:27'),(10,'clientes',13,'INSER├ç├âO','Novo cliente cadastrado: ella | CPF: 443.466.789-88','root@localhost','2025-10-26 15:12:03'),(11,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: Jo├úo da Silva ÔåÆ barata games | Status: 1 ÔåÆ 1','root@localhost','2025-10-26 15:13:53'),(12,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: barata games ÔåÆ barata games | Status: 1 ÔåÆ 0','root@localhost','2025-10-26 15:14:06'),(13,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: JORGE alexandre ÔåÆ JORGE alexandre | Status: 0 ÔåÆ 1','root@localhost','2025-10-26 15:15:21'),(14,'clientes',15,'INSER├ç├âO','Novo cliente cadastrado: quico | CPF: 666.456.789-88','root@localhost','2025-10-26 15:59:42'),(15,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: JORGE alexandre ÔåÆ JORGE alexandre | Status: 1 ÔåÆ 0','root@localhost','2025-10-26 16:56:48'),(16,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: barata games ÔåÆ barata games2 | Status: 0 ÔåÆ 0','root@localhost','2025-10-26 16:59:00'),(17,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: barata games2 ÔåÆ barata games | Status: 0 ÔåÆ 0','root@localhost','2025-10-26 17:06:35'),(18,'clientes',1,'ATUALIZA├ç├âO','Cliente atualizado: barata games ÔåÆ barata games | Status: 0 ÔåÆ 1','root@localhost','2025-10-26 17:06:41'),(19,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: JORGE alexandre ÔåÆ Jorge Alexandre dos Santos Filho | Status: 0 ÔåÆ 0','root@localhost','2025-10-28 22:07:47'),(20,'suportes',7,'INSER├ç├âO','Nova OS criada: roteador sucateado | Status: Aberto','root@localhost','2025-11-02 11:34:36'),(21,'suportes',7,'ATUALIZA├ç├âO','OS atualizada: Aberto ÔåÆ Aberto','root@localhost','2025-11-02 11:34:48'),(22,'suportes',7,'ATUALIZA├ç├âO','OS atualizada: Aberto ÔåÆ Aberto','root@localhost','2025-11-02 11:35:06'),(23,'suportes',7,'ATUALIZA├ç├âO','OS atualizada: Aberto ÔåÆ Resolvido','root@localhost','2025-11-02 11:37:03'),(24,'suportes',8,'INSER├ç├âO','Nova OS criada: asdfghjk | Status: Aberto','root@localhost','2025-11-02 11:43:00'),(25,'clientes',16,'INSER├ç├âO','Novo cliente cadastrado: PIROCA | CPF: 666.666.769-88','root@localhost','2025-11-02 11:54:34'),(26,'suportes',8,'ATUALIZA├ç├âO','OS atualizada: Aberto ÔåÆ Resolvido','root@localhost','2025-11-04 20:41:38'),(27,'suportes',3,'ATUALIZA├ç├âO','OS atualizada: Aberta ÔåÆ Em andamento','root@localhost','2025-11-04 20:41:44'),(28,'clientes',13,'ATUALIZA├ç├âO','Cliente atualizado: ella ÔåÆ ella | Status: 0 ÔåÆ 1','root@localhost','2025-11-04 20:42:07'),(29,'clientes',6,'ATUALIZA├ç├âO','Cliente atualizado: jorginho  ÔåÆ jorginho  | Status: 0 ÔåÆ 1','root@localhost','2025-11-04 20:42:10'),(30,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: Jorge Alexandre dos Santos Filho ÔåÆ Jorge Alexandre dos Santos Filho | Status: 0 ÔåÆ 1','root@localhost','2025-11-04 20:42:14'),(31,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: Jorge Alexandre dos Santos Filho ÔåÆ Jorge Alexandre dos Santos Filho | Status: 1 ÔåÆ 0','root@localhost','2025-11-11 22:10:08'),(32,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: Jorge Alexandre dos Santos Filho ÔåÆ Jorge Alexandre dos Santos Filho | Status: 0 ÔåÆ 1','root@localhost','2025-11-11 22:10:21'),(33,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: Jorge Alexandre dos Santos Filho ÔåÆ Jorge Alexandre dos Santos Filho | Status: 1 ÔåÆ 0','root@localhost','2025-11-11 22:10:23'),(34,'clientes',2,'ATUALIZA├ç├âO','Cliente atualizado: Jorge Alexandre dos Santos Filho ÔåÆ Jorge Alexandre dos Santos Filho | Status: 0 ÔåÆ 0','root@localhost','2025-11-11 22:10:37'),(35,'suportes',9,'INSER├ç├âO','Nova OS criada: Erro no sistema de login | Status: Aberto','root@localhost','2025-11-12 15:41:39'),(36,'clientes',16,'ATUALIZA├ç├âO','Cliente atualizado: PIROCA ÔåÆ val | Status: 1 ÔåÆ 1','root@localhost','2025-11-12 17:57:27'),(37,'suportes',10,'INSER├ç├âO','Nova OS criada: asdfghjk33333 | Status: Em andamento','root@localhost','2025-11-15 15:52:55'),(38,'suportes',10,'ATUALIZA├ç├âO','OS atualizada: Em andamento ÔåÆ Em andamento','root@localhost','2025-11-15 15:53:12'),(39,'clientes',16,'ATUALIZA├ç├âO','Cliente atualizado: val ÔåÆ val | Status: 1 ÔåÆ 1','root@localhost','2025-11-15 15:58:16'),(40,'suportes',6,'ATUALIZA├ç├âO','OS atualizada: Aberta ÔåÆ Aberta','root@localhost','2025-11-15 16:12:51'),(41,'clientes',16,'ATUALIZA├ç├âO','Cliente atualizado: val ÔåÆ val | Status: 1 ÔåÆ 1','root@localhost','2025-11-15 16:13:03'),(42,'suportes',10,'ATUALIZA├ç├âO','OS atualizada: Em andamento ÔåÆ Aberto','root@localhost','2025-11-15 16:13:32'),(43,'suportes',3,'ATUALIZA├ç├âO','OS atualizada: Em andamento ÔåÆ Aberto','root@localhost','2025-11-15 16:13:39'),(44,'suportes',6,'ATUALIZA├ç├âO','OS atualizada: Aberta ÔåÆ Aberta','root@localhost','2025-11-15 17:34:48'),(45,'suportes',6,'ATUALIZA├ç├âO','OS atualizada: Aberta ÔåÆ Aberta','root@localhost','2025-11-15 17:34:54'),(46,'suportes',11,'INSER├ç├âO','Nova OS criada: roteador sucateado | Status: Aberto','root@localhost','2025-11-15 17:35:12'),(47,'clientes',15,'ATUALIZA├ç├âO','Cliente atualizado: quico ÔåÆ thiago | Status: 1 ÔåÆ 1','root@localhost','2025-11-15 17:35:54'),(48,'clientes',16,'ATUALIZA├ç├âO','Cliente atualizado: val ÔåÆ val | Status: 1 ÔåÆ 0','root@localhost','2025-11-15 18:24:21'),(49,'clientes',16,'ATUALIZA├ç├âO','Cliente atualizado: val ÔåÆ val | Status: 0 ÔåÆ 1','root@localhost','2025-11-15 18:24:24'),(50,'suportes',12,'INSER├ç├âO','Nova OS criada: 12345678 | Status: Aberto','root@localhost','2025-11-15 21:20:11'),(51,'clientes',18,'INSER├ç├âO','Novo cliente cadastrado: asdfghjk | CPF: 123.456.789-54','root@localhost','2025-11-17 16:38:00'),(52,'suportes',6,'ATUALIZA├ç├âO','OS atualizada: Aberta ÔåÆ Aberta','root@localhost','2025-11-19 18:05:51'),(53,'suportes',13,'INSER├ç├âO','Nova OS criada: asdfghjk | Status: Aberto','root@localhost','2025-11-19 22:32:33'),(54,'clientes',19,'INSER├ç├âO','Novo cliente cadastrado: sdfghjkl├º | CPF: 704.490.150-68','root@localhost','2025-11-19 22:35:26'),(55,'clientes',19,'ATUALIZA├ç├âO','Cliente atualizado: sdfghjkl├º ÔåÆ sdfghjkl├º | Status: 1 ÔåÆ 1','root@localhost','2025-11-19 22:35:26'),(56,'suportes',8,'ATUALIZA├ç├âO','OS atualizada: Resolvido ÔåÆ Resolvido','root@localhost','2025-11-19 22:39:02'),(57,'clientes',19,'ATUALIZA├ç├âO','Cliente atualizado: sdfghjkl├º ÔåÆ sdfghjkl├º | Status: 1 ÔåÆ 0','root@localhost','2025-11-20 15:59:18');
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimentacoes_equipamento`
--

DROP TABLE IF EXISTS `movimentacoes_equipamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentacoes_equipamento` (
  `id_mov` int NOT NULL AUTO_INCREMENT,
  `id_equipamento` bigint NOT NULL,
  `acao` enum('instalacao','remocao','manutencao','transferencia') NOT NULL,
  `id_tecnico` int NOT NULL,
  `usuario_id` int NOT NULL,
  `data_acao` datetime DEFAULT CURRENT_TIMESTAMP,
  `descricao` text,
  PRIMARY KEY (`id_mov`),
  KEY `id_equipamento` (`id_equipamento`),
  KEY `id_tecnico` (`id_tecnico`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `movimentacoes_equipamento_ibfk_1` FOREIGN KEY (`id_equipamento`) REFERENCES `equipamentos` (`id_equipamento`),
  CONSTRAINT `movimentacoes_equipamento_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnicos` (`id_tecnico`),
  CONSTRAINT `movimentacoes_equipamento_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimentacoes_equipamento`
--

LOCK TABLES `movimentacoes_equipamento` WRITE;
/*!40000 ALTER TABLE `movimentacoes_equipamento` DISABLE KEYS */;
INSERT INTO `movimentacoes_equipamento` VALUES (1,1,'instalacao',1,1,'2025-10-22 00:00:00','Equipamento instalado no cliente Jo├úo Silva.');
/*!40000 ALTER TABLE `movimentacoes_equipamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfis_acesso`
--

DROP TABLE IF EXISTS `perfis_acesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfis_acesso` (
  `perfil_id` int NOT NULL AUTO_INCREMENT,
  `nome_perfil` varchar(100) DEFAULT NULL,
  `descricao` text,
  PRIMARY KEY (`perfil_id`),
  UNIQUE KEY `nome_perfil` (`nome_perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfis_acesso`
--

LOCK TABLES `perfis_acesso` WRITE;
/*!40000 ALTER TABLE `perfis_acesso` DISABLE KEYS */;
INSERT INTO `perfis_acesso` VALUES (1,'Administrador',NULL),(2,'T├®cnico',NULL);
/*!40000 ALTER TABLE `perfis_acesso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planos`
--

DROP TABLE IF EXISTS `planos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planos` (
  `id_plano` int NOT NULL AUTO_INCREMENT,
  `nomeplano` varchar(100) NOT NULL,
  `descricao` text,
  `velocidade` varchar(50) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plano`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planos`
--

LOCK TABLES `planos` WRITE;
/*!40000 ALTER TABLE `planos` DISABLE KEYS */;
INSERT INTO `planos` VALUES (1,'Plano Premium','Internet fibra ├│ptica com Wi-Fi 6 incluso','300Mbps',100.00,1,'2025-09-16 17:21:14','2025-11-15 17:35:39'),(2,'Plano Premium','Internet fibra ├│ptica com Wi-Fi 6 incluso\n','500Mbps',100.00,0,'2025-09-28 19:41:46','2025-11-15 15:58:36'),(3,'Plano Premium','Internet fibra ├│ptica com Wi-Fi 6 inclus','500Mbps',100.00,0,'2025-09-28 19:43:20','2025-11-15 16:21:23'),(4,'Plano Premium','Internet fibra ├│ptica com Wi-Fi 6 incluso','1000Mbps',400.00,1,'2025-09-28 20:05:39','2025-09-28 20:05:39'),(5,'Plano premium','qwertyuio','500Mbps',300.00,1,'2025-10-26 15:57:41','2025-11-04 21:17:19'),(6,'Plano premium','qert','1000Mbps',900.00,1,'2025-10-26 17:09:11','2025-11-15 15:51:29'),(7,'ppp','www','3000mbps',2000.00,0,'2025-11-02 11:52:32','2025-11-12 17:56:57'),(8,'12345678','asdfghjk\n\n','500Mbps',560.00,0,'2025-11-04 21:09:09','2025-11-12 17:57:06'),(9,'Plano premium22','2345678\n','3000mbps',200.00,1,'2025-11-15 15:51:46','2025-11-15 15:51:46');
/*!40000 ALTER TABLE `planos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pop`
--

DROP TABLE IF EXISTS `pop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pop` (
  `id_torre` int NOT NULL AUTO_INCREMENT,
  `localizacao` varchar(255) NOT NULL,
  `ip_gerenciamento` varchar(45) NOT NULL,
  PRIMARY KEY (`id_torre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pop`
--

LOCK TABLES `pop` WRITE;
/*!40000 ALTER TABLE `pop` DISABLE KEYS */;
INSERT INTO `pop` VALUES (1,'Paulista - Centro','192.168.0.1'),(2,'Paulista - Sede','192.168.0.10');
/*!40000 ALTER TABLE `pop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suportes`
--

DROP TABLE IF EXISTS `suportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suportes` (
  `os_id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao_problema` text NOT NULL,
  `data_abertura` datetime DEFAULT CURRENT_TIMESTAMP,
  `inicio_desejado` datetime DEFAULT NULL,
  `conclusao_desejada` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `prioridade` enum('Baixa','M├®dia','Alta','Urgente') NOT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_tecnico` int DEFAULT NULL,
  `codigo_os` varchar(20) DEFAULT NULL,
  `data_interacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`os_id`),
  UNIQUE KEY `codigo_os` (`codigo_os`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_tecnico` (`id_tecnico`),
  CONSTRAINT `suportes_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `suportes_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnicos` (`id_tecnico`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suportes`
--

LOCK TABLES `suportes` WRITE;
/*!40000 ALTER TABLE `suportes` DISABLE KEYS */;
INSERT INTO `suportes` VALUES (3,'Erro no sistema de login','Usu├írio n├úo consegue acessar com as credenciais v├ílidas','2025-09-28 18:29:08','2025-09-28 00:00:00',NULL,'Aberto','Alta',1,NULL,NULL,'2025-10-13 17:36:18'),(6,'Servidor de arquivos inoperante','Todos os funcion├írios est├úo sem acesso ao servidor interno. Servi├ºo parou repentinamente.','2025-10-11 10:35:41','2025-10-12 00:00:00',NULL,'Aberta','Baixa',2,1,'#os430801','2025-10-13 17:36:18'),(7,'roteador sucateado','cliente relata roteador com defeito, sendo sucata. pede retirada e troca por um novo.','2025-11-02 11:34:36',NULL,NULL,'Resolvido','Alta',1,NULL,'#os943602','2025-11-02 11:34:36'),(8,'asdfghjk','asdfghjkcfgvbhjnmkgvbhjn','2025-11-02 11:43:00','2025-11-11 00:00:00',NULL,'Resolvido','Alta',13,2,'#os670824','2025-11-02 11:43:00'),(9,'Erro no sistema de login','estou com problemas ajuda','2025-11-12 15:41:39','2025-11-12 15:41:39',NULL,'Aberto','M├®dia',16,NULL,'#os707482','2025-11-12 15:41:39'),(10,'asdfghjk33333','qwertyuiop','2025-11-15 15:52:55','2025-11-15 00:00:00',NULL,'Aberto','Alta',13,2,'#os318603','2025-11-15 15:52:55'),(11,'roteador sucateado','345','2025-11-15 17:35:12','2025-11-30 00:00:00',NULL,'Aberto','Alta',2,NULL,'#os635565','2025-11-15 17:35:12'),(12,'12345678','2345678','2025-11-15 21:20:11','2025-11-15 21:20:11',NULL,'Aberto','M├®dia',6,NULL,'#os265562','2025-11-15 21:20:11'),(13,'asdfghjk','rtyhujifghj','2025-11-19 22:32:33','2025-11-19 22:32:34',NULL,'Aberto','M├®dia',4,NULL,'#os296418','2025-11-19 22:32:33');
/*!40000 ALTER TABLE `suportes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `gerar_codigo_os` BEFORE INSERT ON `suportes` FOR EACH ROW BEGIN
    DECLARE novo_codigo VARCHAR(20);
    SET novo_codigo = CONCAT('#os', LPAD(FLOOR(RAND() * 900000 + 100000), 6, '0'));
    SET NEW.codigo_os = novo_codigo;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_suporte_insert` AFTER INSERT ON `suportes` FOR EACH ROW BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'suportes',
        NEW.os_id,
        'INSER├ç├âO',
        CONCAT('Nova OS criada: ', NEW.titulo, ' | Status: ', NEW.status),
        CURRENT_USER()
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_suporte_update` AFTER UPDATE ON `suportes` FOR EACH ROW BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'suportes',
        NEW.os_id,
        'ATUALIZA├ç├âO',
        CONCAT('OS atualizada: ', OLD.status, ' ÔåÆ ', NEW.status),
        CURRENT_USER()
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_suporte_delete` AFTER DELETE ON `suportes` FOR EACH ROW BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'suportes',
        OLD.os_id,
        'EXCLUS├âO',
        CONCAT('OS removida: ', OLD.titulo, ' | Status final: ', OLD.status),
        CURRENT_USER()
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tecnicos`
--

DROP TABLE IF EXISTS `tecnicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tecnicos` (
  `id_tecnico` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  `equipe` varchar(100) NOT NULL,
  `status` enum('Ativo','F├®rias','Inativo') NOT NULL,
  PRIMARY KEY (`id_tecnico`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tecnicos`
--

LOCK TABLES `tecnicos` WRITE;
/*!40000 ALTER TABLE `tecnicos` DISABLE KEYS */;
INSERT INTO `tecnicos` VALUES (1,'Jo├úo Silva','TEC001','Equipe A','Ativo'),(2,'bvg-009','234567890','009-BVG','Ativo'),(3,'bvg-005','09876543','005-BVG','Ativo');
/*!40000 ALTER TABLE `tecnicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `matricula` varchar(11) NOT NULL,
  `nome_completo` varchar(255) NOT NULL,
  `login` varchar(100) NOT NULL,
  `perfil_id` int DEFAULT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `senha_hash` varchar(255) NOT NULL,
  `status_usuario` enum('Ativo','Inativo','Bloqueado') NOT NULL DEFAULT 'Ativo',
  `email` varchar(120) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `ultimo_login` datetime DEFAULT NULL,
  `foto_perfil` longtext,
  PRIMARY KEY (`usuario_id`),
  KEY `perfil_id` (`perfil_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`perfil_id`) REFERENCES `perfis_acesso` (`perfil_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'000001','Administrador do Sistema','iii',1,'2025-10-22 22:55:44','','Ativo',NULL,NULL,NULL,NULL),(2,'620567','jorge alexandre','jorge.a',1,'2025-11-11 22:09:44','$2b$10$07i7FboPbC1MzVLL5ZVIbOpVaffW607so65NeySN/sxr.rCoTO0Qe','Inativo',NULL,NULL,'2025-11-20 16:47:53',NULL),(3,'23456','katia h','katiah@proton.com',NULL,'2025-11-15 17:15:10','$2b$10$vuGijICwybpTWTakeplQjeJDjCIMmXYth53wbfW5kGZq2sjWwdKGa','Ativo',NULL,NULL,NULL,NULL),(6,'77777','wagner','wagner@proton.com',2,'2025-11-15 17:34:33','$2b$10$7xxz8JQi/u.vbyVo73mSPO1.4qW3FNphbcguPTpxxCLCP8bSHVMTi','Ativo',NULL,NULL,NULL,NULL),(7,'444445','douglas','douglas',NULL,'2025-11-16 12:05:43','$2b$10$Qv1K4sC0/jLWiUiG8XMP../awS9xwEWMdZtarbUQ9kIWyK7FPQuH6','Ativo',NULL,NULL,NULL,NULL),(8,'999999','Admin Backup','admin_backup',1,'2025-11-20 15:21:34','$2b$10$MTPdwKZueHwEngq0Of4lwOHYp1PanSz.Fcx8VNnqhg96l0aePNGfG','Ativo',NULL,NULL,'2025-11-20 15:24:56',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'GraceNet'
--

--
-- Dumping routines for database 'GraceNet'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_cliente_atualizar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cliente_atualizar`(
    IN p_id_cliente INT,
    IN p_nome_completo VARCHAR(255),
    IN p_telefone VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_cep VARCHAR(9),
    IN p_rua VARCHAR(100),
    IN p_numero VARCHAR(10),
    IN p_nome_rede VARCHAR(50),
    IN p_senha_rede VARCHAR(100),
    IN p_plano VARCHAR(50),
    IN p_vencimento VARCHAR(2),
    IN status TINYINT(1)
)
BEGIN
    UPDATE clientes
    SET 
        nome_completo = p_nome_completo,
        telefone = p_telefone,
        email = p_email,
        cep = p_cep,
        rua = p_rua,
        numero = p_numero,
        nome_rede = p_nome_rede,
        senha_rede = p_senha_rede,
        plano = p_plano,
        vencimento = p_vencimento,
        status = p_status
    WHERE id_cliente = p_id_cliente;

    SELECT * FROM clientes WHERE id_cliente = p_id_cliente;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cliente_inserir` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cliente_inserir`(
    IN p_cpf VARCHAR(14),
    IN p_nome_completo VARCHAR(255),
    IN p_data_nascimento DATE,
    IN p_rg VARCHAR(20),
    IN p_telefone VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_cep VARCHAR(9),
    IN p_rua VARCHAR(100),
    IN p_numero VARCHAR(10),
    IN p_nome_rede VARCHAR(50),
    IN p_senha_rede VARCHAR(100),
    IN p_plano VARCHAR(50),
    IN p_vencimento VARCHAR(2),
    IN p_status TINYINT(1),
    IN p_id_plano INT 
)
BEGIN
    INSERT INTO clientes(
        cpf, nome_completo, data_nascimento, rg, telefone, email,
        cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano
    )
    VALUES (
        p_cpf, p_nome_completo, p_data_nascimento, p_rg, p_telefone, p_email,
        p_cep, p_rua, p_numero, p_nome_rede, p_senha_rede, p_plano, p_vencimento, p_status, p_id_plano
    );

    SELECT * FROM clientes WHERE id_cliente = LAST_INSERT_ID();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_editar_equipamento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_editar_equipamento`(
    IN p_id_equipamento BIGINT,
    IN p_tipo VARCHAR(50),
    IN p_modelo VARCHAR(100),
    IN p_fabricante VARCHAR(100),
    IN p_numero_serie VARCHAR(100),
    IN p_localizacao VARCHAR(100),
    IN p_status VARCHAR(30),
    IN p_observacoes TEXT
)
BEGIN
    UPDATE equipamentos
    SET tipo = p_tipo,
        modelo = p_modelo,
        fabricante = p_fabricante,
        numero_serie = p_numero_serie,
        localizacao = p_localizacao,
        status = p_status,
        observacoes = p_observacoes
    WHERE id_equipamento = p_id_equipamento;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_excluir_equipamento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_excluir_equipamento`(
    IN p_id_equipamento BIGINT
)
BEGIN
    DELETE FROM equipamentos WHERE id_equipamento = p_id_equipamento;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_inserir_equipamento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_inserir_equipamento`(
    IN p_id_equipamento BIGINT,
    IN p_tipo VARCHAR(50),
    IN p_modelo VARCHAR(100),
    IN p_fabricante VARCHAR(100),
    IN p_numero_serie VARCHAR(100),
    IN p_localizacao VARCHAR(100),
    IN p_status VARCHAR(30),
    IN p_observacoes TEXT
)
BEGIN
    INSERT INTO equipamentos (
        id_equipamento, tipo, modelo, fabricante, numero_serie,
        localizacao, status, observacoes
    )
    VALUES (
        p_id_equipamento, p_tipo, p_modelo, p_fabricante, p_numero_serie,
        p_localizacao, p_status, p_observacoes
    );
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 16:16:03
