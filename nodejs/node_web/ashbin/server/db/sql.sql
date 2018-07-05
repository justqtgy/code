create table gps_data(
    id int PRIMARY KEY identity(1,1),
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
    add_time datetime not null
)
create index ix_gps_id on gps_data(gps_id)
create index ix_add_time on gps_data(add_time)

create table gps_last(
    id int PRIMARY KEY identity(1,1),
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
    alarm_info TINYINT not null,--0正常,1移走，10干扰, 11移走并干扰
    add_time DATETIME not null,
    update_time DATETIME not null
)
create index ix_gps_id on gps_last(gps_id)
create index ix_update_time on gps_last(update_time)

create table gsp_info(
    id int IDENTITY(1,1),
    gps_id varchar(20) not null,
    address varchar(200) not null,
    status TINYINT not null,
    remark varchar(200) not null
)
create index ix_gps_id on gsp_info(gps_id)

create table gps_alarm(
    id int PRIMARY KEY IDENTITY(1,1),
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
    alarm_info TINYINT not null, --1移走，10干扰, 11移走并干扰
    add_time DATETIME not null
)
create index ix_gps_id on gps_alarm(gps_id)
create index ix_add_time on gps_alarm(add_time)

create table gps_power(
    id int PRIMARY KEY IDENTITY(1,1),
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
    add_time DATETIME not null
)
create index ix_gps_id on gps_power(gps_id)
create index ix_add_time on gps_power(add_time)

create table gps_capacity(
    id int PRIMARY KEY IDENTITY(1,1),
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
    add_time DATETIME not null
)
create index ix_gps_id on gps_capacity(gps_id)
create index ix_add_time on gps_capacity(add_time)

-- create table gps_offline(
--     id int PRIMARY KEY IDENTITY(1,1),
--     gps_id varchar(20) not null,
--     add_time DATETIME not null
-- )
-- create index ix_gps_id on gps_power(gps_id)
-- create index ix_add_time on gps_power(add_time)

/**
*mysql代码
*
*/
-- /*外部用户*/
-- create table member(
-- 	id int identity(1,1) not null, /*从2000001开始*/
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
create table users
(
	id int PRIMARY KEY identity(1,1) not null, /*从1000001开始*/
	account varchar(20) not null,
	password varchar(50) not null,
	user_name varchar(20) not null,
    weixin_id varchar(50) not null,
	mobile varchar(50) not null,
	add_time datetime not null,
    status tinyint not null, /*1正常-1删除*/
    is_admin bit not null
    -- primary key (id),
    -- key ix_account(account),
    -- key ix_mobile(mobile)
)
create index ix_account on users(account)
create index ix_mobile on users(mobile)

create table role
(
	id int PRIMARY KEY identity(1,1) not null,
	role_name varchar(50) not null,
	remark varchar(50) not null
    -- primary key (id)
)

create table action
(
	id int PRIMARY KEY identity(1,1) not null,
	action_name varchar(50) not null,
	remark varchar(50) not null
    -- primary key (id)
)

create table user_role
(
	id int PRIMARY KEY identity(1,1) not null,
	user_id int not null,
	role_id int not null
    -- primary key (id)
)

create table role_action
(
	id int PRIMARY KEY identity(1,1) not null,
	role_id int not null,
	action_id int not null
    -- primary key (id)
)

create table sms
(
    id int PRIMARY KEY identity(1,1) not null,
    mobile varchar(20) not null,
    captch varchar(10) not null,
    content varchar(200) not null,
    type_id tinyint not null,
    add_time datetime not null
    -- primary key (id),
    -- key ix_mobile(mobile),
    -- key ix_add_time(add_time)
)
create index ix_mobile on sms(mobile)
create index ix_add_time on sms(add_time)

create table logs
(
    id int PRIMARY KEY identity(1,1) not null,
    admin_id int not null,
    content text not null,
    type_id tinyint not null,
    add_time datetime not null
    -- primary key (id),
    -- key ix_add_time(add_time)
)

/*初始化数据*/
insert into users(account, password, user_name, weixin_id, mobile, add_time, status, is_admin)  
values('admin','c475eeaec2d16f750c21e53a61884b35','admin','','',now(), 1, 1);