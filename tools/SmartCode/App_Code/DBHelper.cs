using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebMatrix.Data;
using MySql.Data.MySqlClient;

namespace WebMatrixCode
{
    public class DBHelper
    {
        public enum DBType
        {
            SqlServer,
            MySql
        }

        public static List<string> GetDbTables(DBType dbType, string connectionString)
        {          
            List<string> list = new List<string>();
            if (dbType == DBType.SqlServer)
            {
                string strSQL = "select Name from sys.objects where type = 'U' order by Name";
                Database db = Database.OpenConnectionString(connectionString, "System.Data.SqlClient");
                var items = db.Query(strSQL);
                foreach (var item in items)
                {
                    list.Add(item.Name);
                }
            }
            else
            {
                string strSQL = "show tables;";

                MySqlDataReader reader = MySqlHelper.ExecuteReader(connectionString, strSQL);
                while (reader.Read())
                {
                    list.Add(reader[0].ToString());
                }
                reader.Close();
            }
            
            return list;
        }

        public static List<TableDesc> GetTableColumn(DBType dbType, string connectionString, string tableName)
        {
            List<TableDesc> lists = new List<TableDesc>();
            if (dbType == DBType.SqlServer)
            {
                string strSQL = @"SELECT t1.name as ColumnName, t2.name as DataType,  is_identity as IsKey, t3.value as ColumnDesc
                                FROM sys.columns t1 inner join sys.types t2 on  t1.system_type_id=t2.system_type_id  
	                                left join sys.extended_properties t3 on t1.object_id=t3.major_id and t1.column_id=t3.minor_id
                                WHERE object_id=OBJECT_ID('" + tableName + "') and  t2.system_type_id=t2.user_type_id order by column_id";

                Database db = Database.OpenConnectionString(connectionString, "System.Data.SqlClient");
                var items = db.Query(strSQL);
                foreach (var item in items)
                {
                    lists.Add(new TableDesc() { ColumnName = item.ColumnName, DataType = item.DataType, IsKey = item.IsKey, ColumnDesc = item.ColumnDesc });
                }
            }
            else
            {
                string strSQL = "desc " + tableName + ";";


                MySqlDataReader reader = MySqlHelper.ExecuteReader(connectionString, strSQL);
                while (reader.Read())
                {
                    //lists.Add(new TableDesc() { ColumnName = reader["Field"].ToString(), DataType = reader["Type"].ToString(), Key = reader["Key"].ToString() });
                }
                reader.Close();
            }
            
            return lists;
        }
    }
}
