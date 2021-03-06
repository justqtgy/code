﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace WebMatrixCode.Nodejs
{
    public class SidebarCodeHelper
    {
        public static void CreatePageFile(DBHelper.DBType dbType,string connectionString, string strPath)
        {
            string path = System.Windows.Forms.Application.StartupPath;
            SmartLib.Common.FileHelper f = new SmartLib.Common.FileHelper();
            string tmpContent = f.ReadFileByTxt(path + "\\config\\Nodejs\\sidebar.txt");

            StringBuilder sb = new StringBuilder();
            //获取当前数据库的表
            var tableLists = DBHelper.GetDbTables(dbType,connectionString);
            //循环表
            foreach (var item in tableLists)
            {
                string tableName = item.ToString();
                sb.AppendLine("<li>");
                sb.AppendLine("\t<a href=\"" + tableName + "\"><i class=\"icon - bar - chart\"></i>" + tableName + "</a>");
                sb.AppendLine("</li>"); 
            }

            tmpContent = tmpContent.Replace("<%=sidebar%>", sb.ToString());
            WriteFile(strPath + "\\views\\shared", "_sidebar", tmpContent.ToString());
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
                string sFilePathName = sFilePath + sFileName + ".ejs";
                File.WriteAllText(sFilePathName, sContent, Encoding.UTF8);

            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
