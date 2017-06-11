using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace WebMatrixCode.Nodejs
{
    public class ControllerCodeHelper
    {
        public static void CreateControllerFiles(DBHelper.DBType dbType,string connectionString, string strPath)
        {
            StringBuilder sb = new StringBuilder();
            var tableLists = DBHelper.GetDbTables(dbType,connectionString);
            foreach(var tableName in tableLists)
            {
                //循环表     
                string strUsing = "var " + tableName + " = require('./routes/" + tableName + "');";
                sb.AppendLine(strUsing);
            }
            

            sb.AppendLine();
            sb.AppendLine(@"exports.init_route=function(app){");
            sb.AppendLine("\tconsole.log('init_route begin');");
            foreach (var tableName in tableLists)
            {
                sb.AppendLine("\tapp.use('/" + tableName + "', " + tableName + ");");
            }

            sb.AppendLine("\tconsole.log('init_route end');");
            //sb.AppendLine("\tnext();");
            sb.AppendLine("}");

            WriteFile(strPath , "controller", sb.ToString());
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
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
