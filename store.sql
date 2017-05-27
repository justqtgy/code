--商城配置表操作日志
create table Config_Log
(
	ID int identity(1,1),
	UserAccount varchar(20) not null,
	NickName varchar(20) not null,
	Content varchar(200) not null,
	AddTime datetime not null
)

--分类
create table Config_StoreType
(
	ID int identity(1,1),
	TypeID int not null,
	TypeName varchar(50)
)

--道具分类
create table Config_StoreClass
(
	ID int identity(1,1),
	ClassID int not null,
	ClassName varchar(50)
)

--商城道具购买
create table Config_StoreBuy
(
	ID int identity(1,1),
	BuyType int not null,
	BuyName varchar(50) not null,
	ClassID int not null,
	ClassName varchar(50)
	TypeID int not null,
	TypeName varchar(50) not null
)

CREATE TABLE [dbo].[Game_StoreDestroy] (
[ID] int NOT NULL IDENTITY(1,1) ,
[CreateDate] date NOT NULL ,
[ServerID] int NOT NULL ,
[MoneyType] int NOT NULL ,
[UsedType] int NOT NULL ,
[PropID] int NOT NULL ,
[Number] int NOT NULL ,
[TotalMoney] decimal(18,2) NOT NULL ,
CONSTRAINT [PK_Game_StoreDestroy] PRIMARY KEY NONCLUSTERED ([ID])
)
ON [PRIMARY]
GO

CREATE CLUSTERED INDEX [IX_Game_StoreDestroy] ON [dbo].[Game_StoreDestroy]
([CreateDate] ASC, [ServerID] ASC) 
ON [PRIMARY]
GO


-----mysql
CREATE TABLE `gold_consume_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupid` char(36) NOT NULL,
  `accountid` int(11) NOT NULL,
  `account` char(36) NOT NULL,
  `playerid` bigint(20) NOT NULL,
  `playername` char(36) NOT NULL,
  `itemtypeid` int(11) NOT NULL,
  `itemid` bigint(20) NOT NULL,
  `itemname` char(36) NOT NULL,
  `number` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `has_recycled` int(11) NOT NULL,
  `buytime` int(11) NOT NULL,
  `buy_day` int(11) NOT NULL,
  `consume_type` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_buy_day` (`buy_day`),
  KEY `IX_buytime` (`buytime`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;




--全服查询
--金额模式
SELECT	 *
FROM (SELECT CreateDate, ServerID, SUM(TotalMoney) AS Amount 
	  FROM	dbo.Game_StoreDestroy 
	  WHERE t1.CreateDate>='2017-05-01' and t1.CreateDate<'2017-06-01' 
	  GROUP BY CreateDate, ServerID
	) AS T
PIVOT(SUM(Amount) FOR ServerID IN ([3], [10])) as pvt
ORDER BY CreateDate


SELECT	 *
FROM (SELECT CreateDate, t2.TypeName, SUM(TotalMoney) AS Amount 
	  FROM	dbo.Game_StoreDestroy t1 INNER JOIN Analysis_NYCS_Config.dbo.Config_StoreBuy t2  ON t1.PropID = t2.ClassID
	  WHERE t1.CreateDate>='2017-05-01' and t1.CreateDate<'2017-06-01' and ServerID = 3
	  GROUP BY CreateDate, ServerID 
	) AS T
PIVOT(SUM(Amount) FOR TypeName IN ([3], [10])) as pvt
ORDER BY CreateDate


SELECT	 *
FROM (SELECT CreateDate, t2.ClassName, SUM(TotalMoney) AS Amount 
	  FROM	dbo.Game_StoreDestroy t1 INNER JOIN Analysis_NYCS_Config.dbo.Config_StoreBuy t2  ON t1.PropID = t2.ClassID
	  WHERE t1.CreateDate>='2017-05-01' and t1.CreateDate<'2017-06-01' and ServerID = 3 and t2.TypeID = 1
	  GROUP BY CreateDate, ServerID 
	) AS T
PIVOT(SUM(Amount) FOR ClassName IN ([3], [10])) as pvt
ORDER BY CreateDate

--数量
SELECT	 *
FROM (SELECT CreateDate, t2.ClassName, SUM([Number]) AS Amount 
	  FROM	dbo.Game_StoreDestroy t1 INNER JOIN Analysis_NYCS_Config.dbo.Config_StoreBuy t2  ON t1.PropID = t2.ClassID
	  WHERE t1.CreateDate>='2017-05-01' and t1.CreateDate<'2017-06-01' and ServerID = 3 and t2.TypeID = 1
	  GROUP BY CreateDate, ServerID 
	) AS T
PIVOT(SUM(Amount) FOR ClassName IN ([3], [10])) as pvt
ORDER BY CreateDate




