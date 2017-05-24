/*online : 1正常， -1掉线， -2长时间没有返回*/

insert into Stat_Online values(@CreateDate, @GPSID, @VehicleID, @VehicleNo, @Online, @UpdateTime, @Remark)
update Stat_Online set UpdateTime = @UpdateTime, Online = @Online, Remark = Remark + @Remark where CreateDate = @CreateDate and GPSID=@GPSID
select * from Stat_Online where CreateDate = @CreateDate and GPSID=@GPSID


--表结构
create table Groups
(
    ID int identity(1,1),
    GroupName varchar(50) not null,
    IsEnabled bit not null,
    Remark varchar(250) not null,
    AddTime datetime not null
)

create table Members
(
    ID int identity(1,1),
    Account varchar(20) not null,
    Password varchar(50) not null,
    TrueName varchar(20) not null,
    Email varchar(50) not null,
    Mobile varchar(50) not null,
    AddTime datetime not null,
    ExpireTime datetime not null,    
    IsEnabled bit not null,
    GroupID int not null
)

create table Vehicles
(
    ID int identity(1,1),
    VehicleNo varchar(20) not null,
    GPSID varchar(20) not null,
    Mobile varchar(50) not null,
    GroupID int not null,
    Remark varchar(250) not null
)

create table Drivers
(
    ID int identity(1,1),
    Account varchar(20) not null,
    Password varchar(50) not null,
    Mobile varchar(50) not null,
    IsEnabled bit not null,
    AddTime datetime not null
)

create table Drivers_Vehicles
(
    ID int identity(1,1),
    DriverID int not null,
    GPSID varchar(20) not null,
    VehicleID int not null,
    VehicleNo varchar(20) not null,
    AddTime datetime not null,
    ServicePhone varchar(50) not null,
    Remark varchar(250) not null
)


create table Stat_Online(
    ID int identity(1,1),
    CreateDate datetime not null,
    GPSID varchar(20) not null,
    VehicleID int not null,
    VehicleNo varchar(20) not null,
    Online tinyint not null,
    UpdateTime datetime,
    Remark varchar(max) not null
)

create table Stat_LastInfo(
    ID int identity(1,1),
    GPSID varchar(20) not null,
    VehicleID int not null,
    VehicleNo varchar(20) not null,
    CurDistance decimal(18,4) not null,
    TotalDistance decimal(18,4) not null,
    CurOil decimal(18,4) not null,
    TotalOil decimal(18,4) not null,
    UpdateTime datetime
)

create table Stat_Traffic(
    ID int identity(1,1),
    CreateDate datetime not null,
    GPSID varchar(20) not null,
    VehicleID int not null,
    VehicleNo varchar(20) not null,
    BeginDistance decimal(18,4) not null,
    EndDistance decimal(18,4) not null,
    BeginOil decimal(18,4) not null,
    EndOil decimal(18,4) not null,
    UsedOil decimal(18,4) not null,
    IsOK bit not null
)