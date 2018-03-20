/*postgresql*/

USE gsmy_shijie
GO
--代理会员表
create table member(
	id serial primary key,
	member_no varchar(50) not null, --代理号
	account varchar(50) not null, --代理账号
	true_name varchar(50) not null, --真实姓名
	idcard varchar(20) not null, --身份证
	wexin_id varchar(50) not null, --微信
	mobile varchar(50) not null, --手机号
	parent_id int not null, --上级代理
	join_time timestamp not null, --加入时间
	add_time timestamp not null, --添加时间
	status int not null --状态：1正常，0禁用
)
--订单
create table order_list(
	id serial primary key,
	order_no varchar(50) not null, --订单号
	member_id int not null, --代理id
	number int not null, --数量
	price money not null, --单价
	add_time datetime not null, --下单时间
	status int not null, --状态：2成功发货，1上级确认，0正常，-1取消，-2驳回
)

--日志表:升级、拿货信息推送
create table order_log(
	id int identity(1,1),
	member_id int not null,  --代理成员id
	content varchar(max) not null, --内容
	status int not null, --状态：2成功发货，1上级确认，-1取消，-2驳回
	add_time datetime not null --添加时间
)

--奖励表
create table bounty(
	id int identity(1,1),	
	member_id int not null,  --代理id
	content varchar(max) not null, --奖励内容
	status int not null,	--状态
	--Adminid int not null, --
	add_time datetime not null
)

create table config_grade(
	id int identity(1,1),
	grade int not null,
	price money not null,
	is_enabled bit not null
)

create table sms(
	id int identity(1,1)
	member_id int not null,
	mobile varchar(20) not null, 
	content varchar(max) not null,
	add_time datetime not null
)

/*
;with t as (
	select id from member where member_no='1'
	union all
	select id from member inner join t on member.parent_id = t.id
)
select * from t
*/
