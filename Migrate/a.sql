ALTER TABLE `coco`.`course` 
CHANGE COLUMN `detail_en` `detail_en` MEDIUMTEXT NULL DEFAULT NULL ,
CHANGE COLUMN `detail_vi` `detail_vi` MEDIUMTEXT NULL DEFAULT NULL ;

ALTER TABLE `coco`.`user_connection` 
ADD UNIQUE INDEX `actions_unique` (`created_by_user_id` ASC, `connected_user_id` ASC) VISIBLE;


ALTER TABLE `CoCo`.`user` 
ADD COLUMN `ward_id` INT NULL DEFAULT '1' AFTER `create_by`;

ALTER TABLE `CoCo`.`user_connection` 
ADD COLUMN `connection_request` TINYINT(1) NULL DEFAULT '1' AFTER `connected`;

ALTER TABLE `CoCo`.`user` 
ADD COLUMN `connection_image` VARCHAR(255) NULL DEFAULT NULL AFTER `avatar`;
ALTER TABLE `CoCo`.`user` 
ADD COLUMN `notification` TINYINT(1) NULL DEFAULT 1 AFTER `fullname`;

ALTER TABLE `CoCo`.`course` 
DROP FOREIGN KEY `course_ibfk_1`;
ALTER TABLE `CoCo`.`course` 
DROP COLUMN `user_id`,
ADD COLUMN `center_name` VARCHAR(255) NULL DEFAULT NULL AFTER `id`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
DROP INDEX `user_id` ;
;

