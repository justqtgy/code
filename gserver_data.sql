/*online : 1正常， -1掉线， -2长时间没有返回*/

insert into stat_online values(@CreateDate, @GprsID, @VehicleID, @VehicleNo, @UpdateTime, @Online)
update stat_online set UpdateTime = @UpdateTime, Online = @Online where CreateDate = @CreateDate and GprsID=@GprsID
select * from stat_online where CreateDate = @CreateDate and GprsID=@GprsID


