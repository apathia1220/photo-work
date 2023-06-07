CREATE TABLE mt_photos (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `photo_src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '照片地址',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否展示',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 68 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '照片' ROW_FORMAT = DYNAMIC;

CREATE TABLE mt_photos_order (
  `photo_id` int NOT NULL COMMENT '主键',
  `photo_order` INT AUTO_INCREMENT,
  PRIMARY KEY (`order`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 68 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '照片' ROW_FORMAT = DYNAMIC;