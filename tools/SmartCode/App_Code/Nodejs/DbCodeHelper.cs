using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace WebMatrixCode.Nodejs
{
    public class DbCodeHelper
    {       
        public DbCodeHelper()
        {
            
        }        

        public static void CreateModelFile(string tableName, List<TableDesc> columns, string strPath)
        {
            
                string strDbContext = CreateDbContextFile(tableName, columns);
                WriteFile(strPath + "\\models", tableName, strDbContext);
     
        }

        private static string CreateDbContextFile( string tableName, List<TableDesc> columns)
        {
            string keyName = "ID";//lists.Find(p => p.Key == "PRI").Key;
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("var util = require('util');");
            sb.AppendLine("var db = require('./db');");
            sb.AppendLine();
            sb.AppendLine(CreateEntityString(tableName, columns));
            sb.AppendLine("module.exports = " + tableName);
            sb.AppendLine();

            sb.AppendLine(CreateGetCountFunction(tableName));
            sb.AppendLine(CreateGetListFunction(tableName, keyName));
            sb.AppendLine(CreateGetRecordFunction(tableName, keyName));
            sb.AppendLine(CreateAddFunction(tableName, columns));
            sb.AppendLine(CreateUpdateFunction(tableName, columns));
            sb.AppendLine(CreateDeleteFunction(tableName, keyName));

            return sb.ToString();
        }
        private static string CreateEntityString(string tableName, List<TableDesc> columns)
        {

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("function " + tableName + "(model){");
            

            foreach(var item in columns)
            {
                sb.AppendLine("\tthis." + item.ColumnName.ToLower() + " = model." + item.ColumnName.ToLower() + ";");
            }

            sb.AppendLine("};");
            return sb.ToString();
        }

        private static string CreateGetCountFunction(string tableName)
        {

            StringBuilder sb = new StringBuilder();
            sb.AppendLine(tableName + ".get_count = function(params, callback){");
            sb.AppendLine("\tvar sql = \"select count(*) as total from " + tableName + "\";");
            sb.AppendLine("\tdb.execSQL(sql, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\treturn callback(err);");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tvar total = 0;");
            sb.AppendLine("\t\tif(result.length>0){");
            sb.AppendLine("\t\t\ttotal = result[0].total;");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tcallback(err, total);");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

            return sb.ToString();
        }

        private static string CreateGetListFunction(string tableName, string keyColumn)
        {

            StringBuilder sb = new StringBuilder();
            sb.AppendLine(tableName + ".get_list = function(params, callback){");
            //sb.AppendLine("\tvar startNumber = (pageIndex-1)*pageSize;");
            //sb.AppendLine("\tdb.execSQL('select * from " + tableName + " limit ' + startNumber + ',' + pageSize, function(err, rows, fileds){");
            sb.AppendLine("\tint iBeginID = (params.pageIndex - 1) * params.pageSize + 1;");
            sb.AppendLine("\tint iEndID = params.pageIndex * pageSize;");
            sb.AppendLine("\tvar sql = \" \\");
            sb.AppendLine("\t\t;WITH t AS( \\");
            sb.AppendLine("\t\t\tSELECT ROW_NUMBER() OVER (ORDER BY " + keyColumn + " DESC) AS R_Number,* \\");
            sb.AppendLine("\t\t\tFROM " + tableName + " \\");
            sb.AppendLine("\t\t) \\");
            sb.AppendLine("\t\tSELECT * FROM t WHERE R_Number BETWEEN %s AND %s \";");
            sb.AppendLine("\tsql = util.format(sql, iBeginID, iEndID); ");
            sb.AppendLine("\tdb.execSQL(sql, function(err, rows){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\treturn callback(err);");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tcallback(err, rows);");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

            return sb.ToString();
        }

        private static string CreateGetRecordFunction(string tableName, string keyColumn)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(tableName + ".get_single = function(" + keyColumn.ToLower()+",callback){");
            sb.AppendLine("\tvar sql = \"select * from " + tableName + " where " + keyColumn + " = %s\";" );
            sb.AppendLine("\tsql = util.format(sql, " + keyColumn.ToLower() + "); ");
            sb.AppendLine("\tdb.execSQL(sql, function(err, rows){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\treturn callback(err)");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tcallback(err, rows);");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

            return sb.ToString();
        }

        private static string CreateAddFunction(string tableName, List<TableDesc> colList)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(tableName + ".add = function(params, callback){");
            string strSQL = "\tvar sql = \"insert into " + tableName + "(";
            string strValues = "";
            string strParams = "";
            foreach (var item in colList)
            {
                if (!item.IsKey)
                {
                    strSQL += item.ColumnName + ",";
                    strValues += "'%s',";
                    strParams += "params."+item.ColumnName + ",";
                }
            }

            strSQL = strSQL.Remove(strSQL.Length - 1, 1);
            strParams = strParams.Remove(strParams.Length - 1, 1);
            strValues = strValues.Remove(strValues.Length - 1, 1);
            strSQL += ") values(" + strValues + ")\";";
            sb.AppendLine(strSQL);
            strSQL = "\tsql = util.format(sql, "+strParams+");";            
            sb.AppendLine(strSQL);
            sb.AppendLine("\tdb.execSQL(sql, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\treturn callback(err);");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tcallback(err, result);");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

            return sb.ToString();
        }

        private static string CreateUpdateFunction(string tableName, List<TableDesc> colList)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(tableName + ".update = function(params, callback){");
            string strSQL = "\tvar sql = \"update " + tableName + " set ";
            string strWhere = "";
            string strParams = "";
            foreach (var item in colList)
            {
                if (!item.IsKey)
                {
                    strSQL += item.ColumnName + "='%s', ";
                    if (string.IsNullOrEmpty(strParams))
                        strParams += "params." + item.ColumnName;
                    else
                        strParams += ", params." + item.ColumnName;
                }
                else
                {
                    strWhere += "params." + item.ColumnName;
                }
            }
            strSQL = strSQL.Remove(strSQL.Length - 2, 2);//移除最后的逗号空格
            strSQL += " where id = '%s'\";"; //+ strWhere.Remove(strWhere.Length - 4, 4);
            sb.AppendLine(strSQL);
            strSQL = "\tsql = util.format(sql, " + strParams + "," + strWhere + ");";
            sb.AppendLine(strSQL);
            sb.AppendLine("\tdb.execSQL(sql, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\treturn callback(err);");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tcallback(err, result);");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

            return sb.ToString();
        }

        private static string CreateDeleteFunction(string tableName, string keyColumn)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(tableName + ".delete = function(params,callback){");
            sb.AppendLine("\tvar sql = \"delete from " + tableName + " where " + keyColumn + " = '%s'\";");
            sb.AppendLine("\tsql = util.format(sql, params." + keyColumn + ");");
            sb.AppendLine("\tdb.execSQL(sql, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\treturn callback(err);");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tcallback(err, result);");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

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
                string sFilePathName = sFilePath + sFileName + ".js";
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
