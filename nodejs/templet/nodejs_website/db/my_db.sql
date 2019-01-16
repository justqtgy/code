/**
*mysql代码
*
*/
-- /*外部用户*/
-- create table member(
-- 	id int auto_increment not null, /*从2000001开始*/
--     account varchar(20) not null,
-- 	`password` varchar(50) not null,
-- 	user_name varchar(20) not null,
-- 	weixin_id varchar(50) not null,
-- 	mobile varchar(50) not null,
-- 	add_time datetime not null,
-- 	`status` bit not null,
--     primary key (id),
--     key ix_weixin_id(weixin_id),
--     key ix_mobile(mobile)
-- )ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*系统管理员及权限*/
create table user
(
	id int auto_increment not null, /*从1000001开始*/
	account varchar(20) not null,
	`password` varchar(50) not null,
	user_name varchar(20) not null,
    avatar varchar(50) not null,
    weixin_id varchar(50) not null,
	mobile varchar(50) not null,
	add_time datetime not null,
    `status` tinyint not null, /*1正常-1删除*/
    is_admin bit not null,
    primary key (id),
    key ix_account(account),
    key ix_mobile(mobile)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `role`
(
	id int auto_increment not null,
	role_name varchar(50) not null,
	remark varchar(50) not null,
    is_builtin bit not null,/*内置角色，不能删除*/
    primary key (id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

create table `action`
(
	id int auto_increment not null,
	action_name varchar(50) not null,
    req_url varchar(50) not null,
    icon varchar(50) not null,
	parent_id int not null,
    remark varchar(50) not null,    
    primary key (id)
)ENGINE InnoDB DEFAULT CHARSET=utf8;

create table user_role
(
	id int auto_increment not null,
	user_id int not null,
	role_id int not null,
    primary key (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table role_action
(
	id int auto_increment not null,
	role_id int not null,
	action_id int not null,
    primary key (id)
)ENGINE=InnoDB DEFAULT CHARSET = utf8;

create table sms
(
    id int auto_increment not null,
    mobile varchar(20) not null,
    captch varchar(10) not null,
    content varchar(200) not null,
    type_id tinyint not null,
    add_time datetime not null,
    primary key (id),
    key ix_mobile(mobile),
    key ix_add_time(add_time)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table logs
(
    id int auto_increment not null,
    admin_id int not null,
    content text not null,
    type_id tinyint not null,
    add_time datetime not null,
    primary key (id),
    key ix_add_time(add_time)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*初始化数据*/
insert into users(account, password, user_name, weixin_id, mobile, add_time, status, is_admin)  
values('admin','c475eeaec2d16f750c21e53a61884b35','admin','','',now(), 1, 1);