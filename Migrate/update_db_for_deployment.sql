-- table notification definition

-- CREATE TABLE `notification` (
--  `id` int(11) NOT NULL AUTO_INCREMENT,
--  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--  `created_user_id` int(11) NOT NULL,
--  `is_schedule` tinyint(1) DEFAULT 0,
--  `schedule_time` datetime DEFAULT NULL,
--  `is_sent` tinyint(1) DEFAULT 0,
--  `type_of_noti` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
--  PRIMARY KEY (`id`,`created_user_id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table notification definition

CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_user_id` int NOT NULL,
  `is_schedule` tinyint(1) DEFAULT '0',
  `is_sent` tinyint(1) DEFAULT '0',
  `type_of_noti` varchar(255) DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `year` int DEFAULT NULL,
  `month` int DEFAULT NULL,
  `date` int DEFAULT NULL,
  `hour` int DEFAULT NULL,
  `minute` int DEFAULT NULL,
  PRIMARY KEY (`id`,`created_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb3;

-- table user_notification definition

CREATE TABLE `user_notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`,`notification_id`,`user_id`),
  UNIQUE KEY `user_notification_user_id_notification_id_unique` (`notification_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_notification_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_notification_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table user_device_token definition

CREATE TABLE `user_device_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fcm_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `frequency_id` int(11) NOT NULL DEFAULT 1,
  `expire` date NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `user_device_token_frequency_fk` (`frequency_id`),
  CONSTRAINT `user_device_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_device_token_ibfk_2` FOREIGN KEY (`frequency_id`) REFERENCES `frequency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table frequency definition

CREATE TABLE `frequency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `describe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- update table course

ALTER TABLE coco_prepare_prod_0501.course ADD consulting_field_id int(11) DEFAULT NULL;
ALTER TABLE coco_prepare_prod_0501.course ADD teacher_id int(11) DEFAULT NULL;

ALTER TABLE coco_prepare_prod_0501.course
ADD CONSTRAINT `course_ibfk_1`
FOREIGN KEY (`consulting_field_id`) REFERENCES `consulting_field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE coco_prepare_prod_0501.course
ADD CONSTRAINT `course_ibfk_2`
FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE

-- update table banner

ALTER TABLE coco_prepare_prod_0501.banner ADD target varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE coco_prepare_prod_0501.banner ADD target_id int(11) DEFAULT NULL;




-- 22/12/2022 add new column in table USER
ALTER TABLE coco_prepare_prod_0501.`user` ADD connection_count int(11);
ALTER TABLE coco_prepare_prod_0501.`user` ADD connection_count_default int(11);

-- 4/1/2023 update DB server test
-- config definition
CREATE TABLE `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `swipe_number` int(11) NOT NULL DEFAULT 10,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- notification update
-- ALTER TABLE coco_prepare_prod_0501.notification DROP COLUMN `schedule_time`;
-- ALTER TABLE coco_prepare_prod_0501.notification ADD `content` varchar(255) NOT NULL;
-- ALTER TABLE coco_prepare_prod_0501.notification ADD `year` int(11) DEFAULT NULL;
-- ALTER TABLE coco_prepare_prod_0501.notification ADD `month` int(11) DEFAULT NULL;
-- ALTER TABLE coco_prepare_prod_0501.notification ADD `date` int(11) DEFAULT NULL;
-- ALTER TABLE coco_prepare_prod_0501.notification ADD `hour` int(11) DEFAULT NULL;
-- ALTER TABLE coco_prepare_prod_0501.notification ADD `minute` int(11) DEFAULT NULL;

--  notification model update
ALTER TABLE coco_prepare_prod_0501.notification MODIFY COLUMN title varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL;
ALTER TABLE coco_prepare_prod_0501.notification MODIFY COLUMN description varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL;

-- user table update
ALTER TABLE coco_prepare_prod_0501.`user` ADD `reason_register` varchar(255) DEFAULT NULL;

-- create table user_mobile_notification definition

CREATE TABLE `user_mobile_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `notification_id` int NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_mobile_notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb3;

-- update user table
ALTER TABLE coco.`user` ADD `reason_lock` varchar(255) DEFAULT NULL;

-- update SQL from 10/01/2023

-- update table user
ALTER TABLE coco.`user` ADD is_removed tinyint(1) DEFAULT 0 NOT NULL;

-- table blog definition

CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` varchar(10000) NOT NULL,
  `created_user_id` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  `thumbnail` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`,`created_user_id`),
  KEY `created_user_id` (`created_user_id`),
  CONSTRAINT `blog_ibfk_1` FOREIGN KEY (`created_user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- update notification table
ALTER TABLE coco.`notification` DROP COLUMN `year`;
ALTER TABLE coco.`notification` DROP COLUMN `month`;
ALTER TABLE coco.`notification` DROP COLUMN `date`;
ALTER TABLE coco.`notification` DROP COLUMN `hour`;
ALTER TABLE coco.`notification` DROP COLUMN `minute`;
ALTER TABLE coco.`notification` ADD `sent_time` datetime NOT NULL;
-- update 16/02/2023

-- DROP old config table
DROP TABLE `config`;
-- create new config table
-- config definition

CREATE TABLE `config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;


-- UPDATE DATABASE FROM 22/03/2023:

-- coco.user_notification definition

CREATE TABLE `user_notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int NOT NULL,
  `user_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_notification_user_id_notification_id_unique` (`notification_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_notification_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_notification_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=360 DEFAULT CHARSET=utf8mb3;


-- coco.notification definition

CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_user_id` int NOT NULL,
  `is_schedule` tinyint(1) DEFAULT '0',
  `is_sent` tinyint(1) DEFAULT '0',
  `type_of_noti` varchar(255) DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `year` int DEFAULT NULL,
  `month` int DEFAULT NULL,
  `date` int DEFAULT NULL,
  `hour` int DEFAULT NULL,
  `minute` int DEFAULT NULL,
  `sent_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sub_type_of_noti` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `created_user_id_idx` (`created_user_id`),
  CONSTRAINT `created_user` FOREIGN KEY (`created_user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb3;


-- coco.banner redefinition

DROP TABLE `banner`

CREATE TABLE `banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `banner_directory` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `banner_url` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `oridinal_number` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=400 DEFAULT CHARSET=utf8mb3;