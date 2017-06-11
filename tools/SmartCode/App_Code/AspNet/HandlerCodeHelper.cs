using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using WebMatrix.Data;


namespace WebMatrixCode.AspNet
{
    public class HandlerCodeHelper
    {
        public static void CreateHandlerFiles(string tableName, List<TableDesc> columns, string strPath, string strNamespace)
        {          
            string strUsing = "using System;\r\nusing System.Data;\r\nusing System.Web;\r\nusing "+strNamespace+ ".Data;\r\nusing SmartLib.Common;";

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("<%@ WebHandler Language=\"C#\" Class=\""+ tableName +"Handler\" %>");
            sb.AppendLine(strUsing);
            sb.AppendLine();


            sb.AppendLine("public class " + tableName + "Handler : IHttpHandler {");
            sb.AppendLine(CreateProcessFunction());
            sb.AppendLine(CreateGetListFunction(strNamespace, tableName));
            sb.AppendLine(CreateGetRecordFunction(strNamespace, tableName));
            sb.AppendLine(CreateAddFunction(db, dbConfig, strNamespace, tableName));
            sb.AppendLine(CreateDeleteFunction(strNamespace, tableName));

            sb.AppendLine("\tpublic bool IsReusable {");
            sb.AppendLine("\t\tget {");
            sb.AppendLine("\t\t\treturn false;");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t}");
            sb.AppendLine("}");

            WriteFile(strPath + "\\Ajax", tableName + "Handler", sb.ToString());            
        }

        private static string CreateProcessFunction()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\tpublic void ProcessRequest (HttpContext context) {");

            sb.AppendLine("\t\tcontext.Response.ContentType = \"text/plain\"; ");
            sb.AppendLine("\t\tstring strType = context.Request[\"m\"];");
            sb.AppendLine("\t\tif (!string.IsNullOrEmpty(strType))");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\t switch (strType)");
            sb.AppendLine("\t\t\t{");
            sb.AppendLine("\t\t\t\tcase \"list\":");
            sb.AppendLine("\t\t\t\t\tGetList(context);");
            sb.AppendLine("\t\t\t\t\tbreak;");
            sb.AppendLine("\t\t\t\tcase \"record\":");
            sb.AppendLine("\t\t\t\t\tGetSingle(context);");
            sb.AppendLine("\t\t\t\t\tbreak;");
            sb.AppendLine("\t\t\t\tcase \"set\":");
            sb.AppendLine("\t\t\t\t\tSetRecord(context);");
            sb.AppendLine("\t\t\t\t\tbreak;");
            sb.AppendLine("\t\t\t\tcase \"delete\":");
            sb.AppendLine("\t\t\t\t\tDeleteRecord(context);");
            sb.AppendLine("\t\t\t\t\tbreak;");
            sb.AppendLine("\t\t\t}");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t}");

            return sb.ToString();
        }

        private static string CreateGetListFunction(string strNamespace, string tableName)
        {            
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t/// <summary>");
            sb.AppendLine("\t/// GetList");
            sb.AppendLine("\t/// </summary>");
            sb.AppendLine("\tprivate void GetList(HttpContext context)");
            sb.AppendLine("\t{");
            sb.AppendLine("\t\tint rowNumber;");
            sb.AppendLine("\t\tint pageIndex = int.Parse(context.Request[\"pageindex\"]);");
            sb.AppendLine("\t\tint pageSize = int.Parse(context.Request[\"pagesize\"]);");
            sb.AppendLine("\t\tDataTable items = new " + strNamespace + ".Data.DbAccess." + tableName + "().GetList(pageIndex, pageSize, out rowNumber) as DataTable;");
            sb.AppendLine("\t\tstring jsonData = JsonHelper.DataTableToJSON(items, \"rows\");");
            sb.AppendLine("\t\tcontext.Response.Write(jsonData);");
            sb.AppendLine("\t}");

            return sb.ToString();
        }

        private static string CreateGetRecordFunction(string strNamespace, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t/// <summary>");
            sb.AppendLine("\t/// GetSingle");
            sb.AppendLine("\t/// </summary>");
            sb.AppendLine("\tprivate void GetSingle(HttpContext context)");
            sb.AppendLine("\t{");
            sb.AppendLine("\t\tint id = int.Parse(context.Request[\"id\"]);");
            sb.AppendLine("\t\tvar items = new " + strNamespace + ".Data.DbAccess." + tableName + "().GetSingle(id); ");
            sb.AppendLine("\t\tstring jsonData = JsonHelper.DataTableToJSON(items, \"rows\");");
            sb.AppendLine("\t\tcontext.Response.Write(jsonData);");
            sb.AppendLine("\t}");

            return sb.ToString();
        }

        private static string CreateAddFunction(Database db, DBConfig dbConfig, string strNamespace, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t/// <summary>");
            sb.AppendLine("\t/// SetRecord");
            sb.AppendLine("\t/// </summary>");
            sb.AppendLine("\tprivate void SetRecord(HttpContext context)");
            sb.AppendLine("\t{");
            sb.AppendLine("\t\t" + strNamespace + ".Data.Entity." + tableName + " model = new " + strNamespace + ".Data.Entity." + tableName + "();");

            string strItems = string.Empty;
            string strValues = string.Empty;

            IEnumerable<dynamic> lists = MatrixDataHelper.GetTableColumn(db, tableName, dbConfig.DBType);
            foreach (var item in lists)
            {
                //if (item.ColumnName.ToLower() == "id")
                //{
                //    continue;
                //}
                string strType = DBConfig.GetSystemType(item.DataType);
                if (strType == "string")
                    sb.AppendLine("\t\t" + "model." + item.ColumnName + " = context.Request[\"" + item.ColumnName.ToLower() + "\"];");
                else
                    sb.AppendLine("\t\t" + "model." + item.ColumnName + " = " + strType + ".Parse(context.Request[\"" + item.ColumnName.ToLower() + "\"]);");
            }

            sb.AppendLine("\t\tbool isTrue = false;");
            sb.AppendLine("\t\tif (model.ID == 0)");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tisTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Insert(model); ");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\telse");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tisTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Update(model); ");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tcontext.Response.Write(isTrue.ToString());");
            sb.AppendLine("\t}");
            return sb.ToString();
        }

        private static string CreateDeleteFunction(string strNamespace, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t/// <summary>");
            sb.AppendLine("\t/// DeleteRecord");
            sb.AppendLine("\t/// </summary>");
            sb.AppendLine("\tprivate void DeleteRecord(HttpContext context)");
            sb.AppendLine("\t{");
            sb.AppendLine("\t\tint id = int.Parse(context.Request[\"id\"]);");
            sb.AppendLine("\t\tbool isTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Delete(id); ");
            sb.AppendLine("\t\tcontext.Response.Write(isTrue.ToString());");
            sb.AppendLine("\t}");

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
                string sFilePathName = sFilePath + sFileName + ".ashx";
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
