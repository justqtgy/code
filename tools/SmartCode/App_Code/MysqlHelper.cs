using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace WebMatrixCode
{
    public class MysqlHelper
    {

        public static List<string> GetDbTables(string connectionString)
        {
            List<string> list = new List<string>();
            string strSQL = "show tables;";

            MySqlDataReader reader = MySqlHelper.ExecuteReader(connectionString, strSQL);
            while(reader.Read())
            {
                list.Add(reader[0].ToString());
            }
            reader.Close();   
            return list;
        }

        public static List<TableDesc> GetTableColumn(string connectionString, string tableName)
        {
            List<TableDesc> lists = new List<TableDesc>();
            string strSQL = "desc " + tableName + ";";


            MySqlDataReader reader = MySqlHelper.ExecuteReader(connectionString, strSQL);
            while (reader.Read())
            {
                lists.Add(new TableDesc() { Field = reader["Field"].ToString(), Type = reader["Type"].ToString(), Key = reader["Key"].ToString() });
            }
            reader.Close();
            return lists;
        }

       
    }
}
