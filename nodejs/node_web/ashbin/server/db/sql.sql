create table gps_data(
    id int identity(1,1),
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

create table gps_last(
    id int identity(1,1),
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

create table gsp_info(
    id int IDENTITY(1,1),
    gps_id varchar(20) not null,
    address varchar(200) not null,
    status TINYINT not null,
    remark varchar(200) not null
)

create table gps_alarm(
    id int IDENTITY(1,1),
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

create table gps_power(
    id int IDENTITY(1,1),
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

create table gps_capacity(
    id int IDENTITY(1,1),
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