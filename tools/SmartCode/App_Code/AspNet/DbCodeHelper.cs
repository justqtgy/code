using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using WebMatrix.Data;
using WebMatrixCode;

namespace WebMatrixCode.AspNet
{
    public class DbCodeHelper
    {       
        public DbCodeHelper()
        {
            
        }

        public static void CreateCSFile(string tableName, List<TableDesc> columns, string strPath, string strNamespace)
        {
            string strDbBase = CreateDbBaseFile();
            WriteFile(strPath + "\\DbBase", "DatabaseHelper", strDbBase);

            string strDbContext = CreateDbContextFile(strNamespace, tableName, columns);
            WriteFile(strPath + "\\DbAccess", tableName, strDbContext);

            string strEntity = CreateEntityFile(strNamespace, tableName, columns);
            WriteFile(strPath + "\\Entity", tableName, strEntity);

        }

        private static string CreateDbBaseFile()
        {
            string strUsing = "using System;\r\nusing System.Collections.Generic;\r\nusing System.Linq;\r\nusing System.Text;\r\nusing System.Threading.Tasks;\r\nusing WebMatrix.Data;";
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(strUsing);
            sb.AppendLine();
            sb.AppendLine("public class DatabaseHelper");
            sb.AppendLine("{");
            sb.AppendLine("\tinternal Database db = null;");
            sb.AppendLine();
            sb.AppendLine("\tpublic DatabaseHelper()");
            sb.AppendLine("\t{");
            sb.AppendLine("\t\tdb = Database.Open(\"conn\");");
            sb.AppendLine("\t}");
            sb.AppendLine("}");
            return sb.ToString();
        }

        private static string CreateDbContextFile(string strNamespace, string tableName, List<TableDesc> columns)
        {
            var firstItem = columns.First<dynamic>();
            var keyName = firstItem.ColumnName;
            var keyType =  DBConfig.GetSystemType(firstItem.DataType);


            string strUsing = "using System;\r\nusing System.Collections.Generic;\r\nusing System.Linq;\r\nusing System.Text;\r\nusing System.Threading.Tasks;\r\nusing WebMatrix.Data;";

            StringBuilder sb = new StringBuilder();
            sb.AppendLine(strUsing);
            sb.AppendLine();

            sb.AppendLine("namespace " + strNamespace + ".Data.DbAccess");
            sb.AppendLine("{");
            sb.AppendLine("\tpublic class " + tableName + " : DatabaseHelper");
            sb.AppendLine("\t{");
            sb.AppendLine("\t\t");
            //sb.AppendLine(CreateGetMaxIDFunction(tableName, keyName));
            //sb.AppendLine(CreateExistsFunction(tableName, keyType, keyName));
            sb.AppendLine(CreateGetListFunction(tableName, keyName));
            sb.AppendLine(CreateGetRecordFunction(tableName, keyType, keyName));
            sb.AppendLine(CreateAddFunction(tableName, columns));
            sb.AppendLine(CreateUpdateFunction(tableName, columns));
            sb.AppendLine(CreateDeleteFunction(tableName, keyType, keyName));
            sb.AppendLine("\t}");
            sb.AppendLine("}");
            return sb.ToString();
        }
        private static string CreateEntityFile(string strNamespace, string tableName, List<TableDesc> columns)
        {
            string strUsing = "using System;\r\nusing System.Collections.Generic;\r\nusing System.Linq;\r\nusing System.Text;";

            StringBuilder sb = new StringBuilder();
            sb.AppendLine(strUsing);
            sb.AppendLine();

            sb.AppendLine("namespace " + strNamespace+".Data.Entity");
            sb.AppendLine("{");
            sb.AppendLine("\tpublic class " + tableName);
            sb.AppendLine("\t{");

            foreach(var item in columns)
            {                
                sb.AppendLine("\t\t/// <summary>");
                sb.AppendLine("\t\t/// " + item.ColumnName);
                sb.AppendLine("\t\t/// </summary>");
                sb.AppendLine("\t\tpublic " + DBConfig.GetSystemType(item.DataType) + " " + item.ColumnName + " { get; set; }");
            }
            
            sb.AppendLine("\t}");
            sb.AppendLine("}");
            return sb.ToString();
        }

        private static string CreateGetMaxIDFunction(string tableName, string keyColumn)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// GetMaxID");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic int GetMaxID()");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tstring strSQL = \"SELECT MAX(" + keyColumn + ") FROM " + tableName + "\"; ");
            sb.AppendLine("\t\t\tint maxId = (int)db.QueryValue(strSQL);");
            sb.AppendLine("\t\t\tmaxId++;");
            sb.AppendLine("\t\t\treturn maxId;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        private static string CreateExistsFunction(string tableName, string keyType,string keyColumn)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// Exists");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic bool Exists(" + keyType + " " + keyColumn.ToLower() + ")");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tstring strSQL = \"SELECT * FROM " + tableName + " WHERE " + keyColumn + " = @0\"; ");
            sb.AppendLine("\t\t\tdynamic model = db.QuerySingle(strSQL, " + keyColumn.ToLower() + ");");
            sb.AppendLine("\t\t\tif (model." + keyColumn + ">0)");
            sb.AppendLine("\t\t\t\t return true;");
            sb.AppendLine("\t\t\telse");
            sb.AppendLine("\t\t\t\t return false;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        private static string CreateGetListFunction(string tableName, string keyColumn)
        {
            
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// GetList");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic IEnumerable<dynamic> GetList(int pageIndex, int pageSize, out int rowCount)");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tstring strSQL = \"SELECT COUNT(*) FROM " + tableName + " \"; ");
            sb.AppendLine("\t\t\tobject obj = db.QueryValue(strSQL);");
            sb.AppendLine("\t\t\tint.TryParse(obj.ToString(), out rowCount);");
            sb.AppendLine("\t\t\tstrSQL = @\"");
            sb.AppendLine("\t\t\t\t;WITH t AS(");
            sb.AppendLine("\t\t\t\t\tSELECT ROW_NUMBER() OVER (ORDER BY " + keyColumn + " DESC) AS R_Number,*");
            sb.AppendLine("\t\t\t\t\tFROM " + tableName + " ");
            sb.AppendLine("\t\t\t\t)");            
            sb.AppendLine("\t\t\t\tSELECT * FROM t WHERE R_Number BETWEEN @0 AND @1");            
            sb.AppendLine("\t\t\t\t\";");
            sb.AppendLine("\t\t\tint iBeginID = (pageIndex - 1) * pageSize + 1;");
            sb.AppendLine("\t\t\tint iEndID = pageIndex * pageSize;");
            sb.AppendLine("\t\t\tIEnumerable<dynamic> list = db.Query(strSQL, iBeginID, iEndID);");
            sb.AppendLine("\t\t\treturn list;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        private static string CreateGetRecordFunction(string tableName, string keyType, string keyColumn)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// GetRecord");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic dynamic GetSingle(" + keyType + " " + keyColumn.ToLower() + ")");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tstring strSQL = \"SELECT * FROM " + tableName + " WHERE "+keyColumn+" = @0\"; ");
            sb.AppendLine("\t\t\tdynamic model = db.QuerySingle(strSQL, " + keyColumn.ToLower() + ");");
            sb.AppendLine("\t\t\treturn model;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        private static string CreateAddFunction(string tableName, List<TableDesc> columns)
        {            
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// Insert");
            sb.AppendLine("\t\t/// </summary>");
            sb.Append("\t\tpublic bool Insert(Entity." + tableName + " " + tableName.ToLower() + ")");

            sb.AppendLine("\t\t{");
            sb.Append("\t\t\tstring strSQL = @\"INSERT INTO " + tableName + "(");

            int i = 0;
            string strItems = string.Empty;
            string strValues = string.Empty;

            foreach (var item in columns)
            {
                if (item.ColumnName.ToLower() == "id")
                {
                    continue;
                }

                sb.Append(item.ColumnName + ", ");
                strValues += "@" + i + ", ";
                strItems += tableName.ToLower() + "." + item.ColumnName + ", ";
 
                i++;
            }
            sb.Remove(sb.ToString().LastIndexOf(','), 1);

            sb.AppendLine(") VALUES(" + strValues.Trim().TrimEnd(',') + ")\";");

            //sb.AppendLine(" strSQL += \" select scope_identity() \"; ");
            //sb.AppendLine("\t\t\tint rowAffected = db.QueryValue(strSQL, " + strItems.Trim().TrimEnd(',') + ");");
            sb.AppendLine("\t\t\tint rowAffected = db.Execute(strSQL, " + strItems.Trim().TrimEnd(',') + ");");
            sb.AppendLine("\t\t\tif (rowAffected > 0)");
            sb.AppendLine("\t\t\t\t return true;");
            sb.AppendLine("\t\t\telse");
            sb.AppendLine("\t\t\t\t return false;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }


        private static string CreateUpdateFunction(string tableName,List<TableDesc> columns)
        {
            
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// Update");
            sb.AppendLine("\t\t/// </summary>");
            sb.Append("\t\tpublic bool Update(Entity." + tableName + " " + tableName.ToLower() + ")");

            sb.AppendLine("\t\t{");
            sb.Append("\t\t\tstring strSQL = @\"UPDATE " + tableName + " SET ");

            int i = 0;
            string strItems = string.Empty;
            string strValues = string.Empty;

            var firstItem = columns.First<dynamic>();
            var keyName = firstItem.ColumnName;
            foreach (var item in columns)
            {
 
                if (item.ColumnName.ToLower() == keyName.ToLower())
                {                  
                    strItems += tableName.ToLower() + "." + item.ColumnName + ", ";
                    continue;
                }
                i++;
                sb.Append(item.ColumnName + "=@" + i.ToString() + ", ");
                strItems += tableName.ToLower() + "." + item.ColumnName + ", ";
                
            }
            sb.Remove(sb.ToString().LastIndexOf(','), 1);

            sb.AppendLine(" WHERE " + keyName + "=@0\";");

            sb.AppendLine("\t\t\tint rowAffected = db.Execute(strSQL, " + strItems.Trim().TrimEnd(',') + ");");
            sb.AppendLine("\t\t\tif (rowAffected > 0)");
            sb.AppendLine("\t\t\t\t return true;");
            sb.AppendLine("\t\t\telse");
            sb.AppendLine("\t\t\t\t return false;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        private static string CreateDeleteFunction(string tableName, string keyType,string keyColumn)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// Delete");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic bool Delete(" + keyType + " " + keyColumn.ToLower() + ")");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tstring strSQL = \"DELETE FROM " + tableName + " WHERE " + keyColumn + " = @0\"; ");
            sb.AppendLine("\t\t\tint rowAffected = db.Execute(strSQL, " + keyColumn .ToLower()+ ");");
            sb.AppendLine("\t\t\tif (rowAffected > 0)");
            sb.AppendLine("\t\t\t\t return true;");
            sb.AppendLine("\t\t\telse");
            sb.AppendLine("\t\t\t\t return false;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        /// <summary>
        /// 将特定文本内容写入特定文件(覆盖写入)
        /// </summary>
        /// <param name="sFilePath">文件存储地址（物理路径）</param>
        /// <param name="sFileName">文件名字</param>
        /// <param name="sContent">文件内容</param>
        private static void WriteFile(string sFilePath, string sFileName, string sContent)
        {            
            if (!Directory.Exists(sFilePath)) Directory.CreateDirectory(sFilePath);
            if (!sFilePath.EndsWith("\\")) sFilePath = sFilePath + "\\";

            try
            {
                string sFilePathName = sFilePath + sFileName + ".cs";
                File.WriteAllText(sFilePathName, sContent, Encoding.UTF8);

                //string copyFile = "DatabaseHelper.cs";
                //File.Copy(copyFile, sFilePath + copyFile, true);

            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
