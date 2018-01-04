/**
*mysql代码
*
*/
/*外部用户*/
create table member(
	id int auto_increment not null, /*从2000001开始*/
	weixin_id varchar(50) not null,
	user_name varchar(50) not null,
	mobile varchar(50) not null,
	add_time datetime not null,
	`status` bit not null,
    primary key (id),
    key ix_weixin_id(weixin_id),
    key ix_mobile(mobile)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*系统管理员及权限*/
create table admin_user
(
	id int auto_increment not null, /*从1000001开始*/
	account varchar(20) not null,
	`password` varchar(50) not null,
	user_name varchar(20) not null,
	mobile varchar(50) not null,
	add_time datetime not null,
    `status` int not null,
    primary key (id),
    key ix_account(account),
    key ix_mobile(mobile)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `role`
(
	id int auto_increment not null,
	role_name varchar(50) not null,
	remark varchar(50) not null,
    primary key (id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

create table `action`
(
	id int auto_increment not null,
	action_name varchar(50) not null,
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
    type_id int not null,
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
    add_time datetime not null,
    primary key (id),
    key ix_add_time(add_time)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;