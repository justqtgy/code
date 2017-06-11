using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace WebMatrixCode
{
    public class DBConfig
    {
        public static string GetSystemType(string sqlType)
        {
            switch (sqlType.ToLower())
            {
                case "char":
                case "ansistring":
                    return "char";
                case "varchar":
                case "nvarchar":
                case "nvarchar2":
                case "ansistringfixedlength":
                case "stringfixedlength":
                case "string":
                    return "string";
                case "binary":
                case "image":
                case "varbinary":
                case "timestamp":
                    return "byte[]";
                case "bit":
                case "boolean":
                    return "bool";
                case "tinyint":
                case "byte":
                case "sbyte":
                    return "byte";                
                case "datetime":
                case "date":
                case "smalldatetime":
                case "time":
                    return "DateTime";
                case "money":
                case "currency":
                case "decimal":
                case "numeric":
                    return "decimal";
                case "real":
                case "double":
                    return "real";
                case "uniqueidentifier":
                case "guid":
                    return "Guid";
                case "smallint":
                case "int16":
                case "uint16":
                //    return "int16";
                case "int":
                case "int32":
                case "uint32":
                case "number":
                    return "int";
                case "bigint":
                case "int64":
                case "uint64":
                case "varnumeric":
                    return "Int64";
                case "variant":
                case "object":
                    return "object";
                case "float":
                case "single":
                    return "float";                
                case "xml":
                    return "string";
                case "ntext":
                    return "string";
                case "text":
                    return "string";
            }

            return "string";
        }
    }

    public class TableDesc
    {
        public string ColumnName { get; set; }
        public string DataType { get; set; }
        public bool IsKey { get; set; }
        public string ColumnDesc { get; set; }
        //public TableDesc(string columnName, string dataType, string key)
        //{

        //}
    }
}
