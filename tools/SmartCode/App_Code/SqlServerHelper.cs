using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebMatrix.Data;

namespace WebMatrixCode
{
    public class SqlServerHelper
    {

        public static List<string> GetDbTables(string connectionString)
        {
            List<string> list = new List<string>();
            string strSQL = "select Name from sys.objects where type = 'U' order by Name";
            Database db = Database.OpenConnectionString(connectionString);
            var items = db.Query(strSQL);
            foreach(var item in items)
            {
                list.Add(item.Name);
            }
            return list;
        }

        public static IEnumerable<dynamic> GetTableColumn(string connectionString, string tableName)
        {
            Dictionary<string, string> lists = new Dictionary<string, string>();
            string strSQL = strSQL = "SELECT t1.name as ColumnName, t2.name as DataType FROM sys.columns t1 inner join sys.types t2 on  t1.system_type_id=t2.system_type_id  WHERE object_id=OBJECT_ID('" + tableName + "') and  t2.system_type_id=t2.user_type_id order by column_id";

            Database db = Database.OpenConnectionString(connectionString);
            var items = db.Query(strSQL);
            //foreach (var item in items)
            //{
            //    lists.Add(item.ColumnName, GetSystemType(item.DataType));
            //}
            //return lists;
            return items;
        }

       
    }
}
