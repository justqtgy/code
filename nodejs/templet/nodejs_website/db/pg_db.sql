﻿create table gps_data(
    id serial PRIMARY KEY ,
    gps_id varchar(20) not null,
    sn int not null,
    num int not null,
    one_zl decimal(10,2) not null,
    one_rl decimal(10,2) not null,
    one_c1 decimal(10,2) not null,
    one_c2 decimal(10,2) not null,
    two_zl decimal(10,2) not null,
    two_rl decimal(10,2) not null,
    two_c1 decimal(10,2) not null,
    two_c2 decimal(10,2) not null,
    power int not null,
    alarm varchar(50) not null,
    status varchar(50) not null,
    lng varchar(20) not null,
    lat varchar(20) not null,
    high int not null,
    speed int not null,
    direct int not null,
    dist_id int not null,
    distance int not null,
    gps_time varchar(20) not null,
    add_time timestamp not null
);
create index ix_gps_data_gps_id on gps_data(gps_id);
create index ix_gps_data_add_time on gps_data(add_time);

create table gps_last(
    id serial PRIMARY KEY,
    gps_id varchar(20) not null,
    sn int not null,
    num int not null,
    one_zl decimal(10,2) not null,
    one_rl decimal(10,2) not null,
    one_c1 decimal(10,2) not null,
    one_c2 decimal(10,2) not null,
    two_zl decimal(10,2) not null,
    two_rl decimal(10,2) not null,
    two_c1 decimal(10,2) not null,
    two_c2 decimal(10,2) not null,
    power int not null,
    lng varchar(20) not null,
    lat varchar(20) not null,
    dist_id int not null,
    distance int not null,
    gps_time varchar(20) not null,
    alarm_info smallint not null,--0正常,1移走，10干扰, 11移走并干扰
    add_time timestamp not null,
    update_time timestamp not null
);
create index ix_gps_last_gps_id on gps_last(gps_id);
create index ix_gps_last_update_time on gps_last(update_time);

create table gsp_info(
    id serial primary key,
    gps_id varchar(20) not null,
    address varchar(200) not null,
    status smallint not null,
    remark varchar(200) not null
);
create index ix_gps_info_gps_id on gsp_info(gps_id);

create table gps_alarm(
    id serial PRIMARY KEY,
    gps_id varchar(20) not null,    
    one_zl decimal(10,2) not null,
    one_rl decimal(10,2) not null,
    one_c1 decimal(10,2) not null,
    one_c2 decimal(10,2) not null,
    two_zl decimal(10,2) not null,
    two_rl decimal(10,2) not null,
    two_c1 decimal(10,2) not null,
    two_c2 decimal(10,2) not null,
    lng varchar(20) not null,
    lat varchar(20) not null,
    gps_time varchar(20) not null,
    alarm_info smallint not null, --1移走，10干扰, 11移走并干扰
    add_time timestamp not null
);
create index ix_gps_alarm_gps_id on gps_alarm(gps_id);
create index ix_gps_alarm_add_time on gps_alarm(add_time);

create table gps_power(
    id serial PRIMARY KEY ,
    gps_id varchar(20) not null,
    one_zl decimal(10,2) not null,
    one_rl decimal(10,2) not null,
    one_c1 decimal(10,2) not null,
    one_c2 decimal(10,2) not null,
    two_zl decimal(10,2) not null,
    two_rl decimal(10,2) not null,
    two_c1 decimal(10,2) not null,
    two_c2 decimal(10,2) not null,
    power int not null,
    lng varchar(20) not null,
    lat varchar(20) not null,
    gps_time varchar(20) not null,
    add_time timestamp not null
);
create index ix_gps_power_gps_id on gps_power(gps_id);
create index ix_gps_power_add_time on gps_power(add_time);

create table gps_capacity(
    id serial PRIMARY KEY,
    gps_id varchar(20) not null,
    one_zl decimal(10,2) not null,
    one_rl decimal(10,2) not null,
    one_c1 decimal(10,2) not null,
    one_c2 decimal(10,2) not null,
    two_zl decimal(10,2) not null,
    two_rl decimal(10,2) not null,
    two_c1 decimal(10,2) not null,
    two_c2 decimal(10,2) not null,
    lng varchar(20) not null,
    lat varchar(20) not null,
    gps_time varchar(20) not null,
    add_time timestamp not null
);
create index ix_gps_id on gps_capacity(gps_id);
create index ix_add_time on gps_capacity(add_time);

-- create table gps_offline(
--     id int PRIMARY KEY IDENTITY(1,1),
--     gps_id varchar(20) not null,
--     add_time timestamp not null
-- )
-- create index ix_gps_id on gps_power(gps_id)
-- create index ix_add_time on gps_power(add_time)


-- /*外部用户*/
-- create table member(
-- 	id int identity(1,1) not null, /*从2000001开始*/
--     account varchar(20) not null,
-- 	`password` varchar(50) not null,
-- 	user_name varchar(20) not null,
-- 	weixin_id varchar(50) not null,
-- 	mobile varchar(50) not null,
-- 	add_time timestamp not null,
-- 	`status` bit not null,
--     primary key (id),
--     key ix_weixin_id(weixin_id),
--     key ix_mobile(mobile)
-- )ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*系统管理员及权限*/
create table users
(
	id serial PRIMARY KEY, /*从1000001开始*/
	account varchar(20) not null,
	password varchar(50) not null,
	user_name varchar(20) not null,
    weixin_id varchar(50) not null,
	mobile varchar(50) not null,
	add_time timestamp not null,
    status smallint not null, /*1正常-1删除*/
    is_admin boolean not null
);
create index ix_users_account on users(account);
create index ix_users_mobile on users(mobile);

create table roles
(
	id serial PRIMARY KEY,
	role_name varchar(50) not null,
	remark varchar(50) not null
);

create table actions
(
	id serial PRIMARY KEY ,
	action_name varchar(50) not null,
	remark varchar(50) not null
);

create table user_role
(
	id serial PRIMARY KEY,
	user_id int not null,
	role_id int not null
);

create table role_action
(
	id serial PRIMARY KEY not null,
	role_id int not null,
	action_id int not null
);

create table sms
(
    id serial PRIMARY KEY,
    mobile varchar(20) not null,
    captch varchar(10) not null,
    content varchar(200) not null,
    type_id smallint not null,
    add_time timestamp not null
);
create index ix_sms_mobile on sms(mobile);
create index ix_sms_add_time on sms(add_time);

create table logs
(
    id serial PRIMARY KEY not null,
    admin_id int not null,
    content text not null,
    type_id smallint not null,
    add_time timestamp not null
);
create index ix_logs_add_time on logs(add_time);

/*初始化数据*/
insert into users(account, password, user_name, weixin_id, mobile, add_time, status, is_admin)  
values('admin','c475eeaec2d16f750c21e53a61884b35','admin','','',now(), 1, true);