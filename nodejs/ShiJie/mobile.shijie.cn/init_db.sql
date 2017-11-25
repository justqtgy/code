  truncate table [dbo].[Member]
  truncate table [dbo].[Agent]
  truncate table [dbo].[MemberStat]
  truncate table [dbo].[Orders]
  truncate table [dbo].[OrdersLog]
  truncate table [dbo].[SMS]

  insert into Member(Account,	TrueName,	IDCard,	WeChatID,	Mobile,	Password,	AddTime,	Status,	IsAdmim)
  values('admin',	'admin','', '','','c475eeaec2d16f750c21e53a61884b35',	'2017-10-01',	1,	1)