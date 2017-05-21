/*online : 1正常， -1掉线， -2长时间没有返回*/

insert into stat_online values(@CreateDate, @GprsID, @VehicleID, @VehicleNo, @UpdateTime, @Online)
update stat_online set UpdateTime = @UpdateTime, Online = @Online where CreateDate = @CreateDate and GprsID=@GprsID
select * from stat_online where CreateDate = @CreateDate and GprsID=@GprsID


表结构

Groups
{
    ID,
    GroupName,
    IsEnabled,
    Remark,
    AddTime,    
    AdminID
}

Members
{
    ID,
    Account,
    Password,
    TrueName,
    Email,
    Mobile,
    AddTime,
    ExpireTime,    
    IsEnabled,
    GroupID
}

Vehicles
{
    ID,
    VehicleNo,
    GPRSID,
    Mobile,
    GroupID,
    Remark
}

Drivers
{
    ID,
    UserAccount,
    Password,
    Mobile,
    IsEnabled,
    AddTime
}

Drivers_Vehicles
{
    ID,
    DriverID,
    VehicleID,
    VehicleNo,
    AddTime,
    ServicePhone,
    Remark
}