using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using WebMatrix.Data;

namespace WebMatrixCode.AspNet
{
    public class ControllerCodeHelper
    {
        public static void CreateControllerFiles(string tableName, List<TableDesc> columns, string strPath, string strNamespace)
        {
            string strUsing = "using System;\r\nusing System.Collections.Generic;\r\nusing System.Linq;\r\nusing System.Text;\r\nusing System.Threading.Tasks;\r\nusing System.Web;\r\nusing System.Web.Http;\r\nusing WebMatrix.Data;\r\nusing SmartLib.Common;";

            StringBuilder sb = new StringBuilder();
            sb.AppendLine(strUsing);
            sb.AppendLine();

            sb.AppendLine("namespace " + strNamespace + ".Controllers");
            sb.AppendLine("{");
            sb.AppendLine("\tpublic class " + tableName + "Controller : ApiController");
            sb.AppendLine("\t{");
            sb.AppendLine("\t\t");
            sb.AppendLine(CreateGetListFunction(strNamespace, tableName));
            sb.AppendLine(CreateGetRecordFunction(strNamespace, tableName));
            sb.AppendLine(CreatePostFunction(strNamespace, tableName));
            // sb.AppendLine(CreatePutFunction(db, dbConfig, strNamespace, tableName));
            sb.AppendLine(CreateDeleteFunction(strNamespace, tableName));
            sb.AppendLine("\t}");
            sb.AppendLine("}");

            WriteFile(strPath + "\\Controllers", tableName + "Controller", sb.ToString());
        }

        private static string CreateGetListFunction(string strNamespace, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// GET api/<controller>");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic PageData<dynamic> Get(int pageIndex, int pageSize)");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tint rowNumber = 0;");
            sb.AppendLine("\t\t\tvar items = new " + strNamespace + ".Data.DbAccess." + tableName + "().GetList(pageIndex, pageSize, out rowNumber); ");
            sb.AppendLine("\t\t\tPageData<dynamic> pageData = new PageData<dynamic>();");
            sb.AppendLine("\t\t\tpageData.TotolRecord = rowNumber;");
            sb.AppendLine("\t\t\tpageData.Data = items;");
            sb.AppendLine("\t\t\treturn pageData;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        private static string CreateGetRecordFunction(string strNamespace, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// GET api/<controller>/5");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic dynamic Get(int id)");
            sb.AppendLine("\t\t{");
            sb.AppendLine("\t\t\tvar items = new " + strNamespace + ".Data.DbAccess." + tableName + "().GetSingle(id); ");         
            sb.AppendLine("\t\t\treturn items;");
            sb.AppendLine("\t\t}");

            return sb.ToString();
        }

        private static string CreatePostFunction(string strNamespace, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// POST api/<controller>");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\tpublic bool Post(" + strNamespace + ".Data.Entity." + tableName + " " + tableName.ToLower() + ")");
            sb.AppendLine("\t\t{");
            //sb.AppendLine("\t\t" + strNamespace + ".Data.Entity." + tableName + " model = new " + strNamespace + ".Data.Entity." + tableName + "();");

            //string strItems = string.Empty;
            //string strValues = string.Empty;

            //IEnumerable<dynamic> lists = MatrixDataHelper.GetTableColumn(db, tableName, dbConfig.DBType);
            //foreach (var item in lists)
            //{
            //    //if (item.ColumnName.ToLower() == "id")
            //    //{
            //    //    continue;
            //    //}
            //    string strType = DBConfig.GetSystemType(item.DataType);
            //    if (strType == "string")
            //        sb.AppendLine("\t\t" + "model." + item.ColumnName + " = context.Request[\"" + item.ColumnName.ToLower() + "\"];");
            //    else
            //        sb.AppendLine("\t\t" + "model." + item.ColumnName + " = " + strType + ".Parse(context.Request[\"" + item.ColumnName.ToLower() + "\"]);");
            //}

            sb.AppendLine("\t\t\tbool isTrue = false;");
            sb.AppendLine("\t\t\tif ("+ tableName.ToLower() + ".ID == 0)");
            sb.AppendLine("\t\t\t{");
            sb.AppendLine("\t\t\t\tisTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Insert(" + tableName.ToLower() + "); ");
            sb.AppendLine("\t\t\t}");
            sb.AppendLine("\t\t\telse");
            sb.AppendLine("\t\t\t{");
            sb.AppendLine("\t\t\t\tisTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Update(" + tableName.ToLower() + "); ");
            sb.AppendLine("\t\t\t}");
            sb.AppendLine("\t\t\treturn isTrue;");
            sb.AppendLine("\t\t}");
            return sb.ToString();
        }

        //private static string CreatePutFunction(Database db, DBConfig dbConfig, string strNamespace, string tableName)
        //{
        //    StringBuilder sb = new StringBuilder();
        //    sb.AppendLine("\t/// <summary>");
        //    sb.AppendLine("\t/// SetRecord");
        //    sb.AppendLine("\t/// </summary>");
        //    sb.AppendLine("\tprivate void SetRecord(HttpContext context)");
        //    sb.AppendLine("\t{");
        //    sb.AppendLine("\t\t" + strNamespace + ".Data.Entity." + tableName + " model = new " + strNamespace + ".Data.Entity." + tableName + "();");

        //    string strItems = string.Empty;
        //    string strValues = string.Empty;

        //    //IEnumerable<dynamic> lists = MatrixDataHelper.GetTableColumn(db, tableName, dbConfig.DBType);
        //    //foreach (var item in lists)
        //    //{
        //    //    //if (item.ColumnName.ToLower() == "id")
        //    //    //{
        //    //    //    continue;
        //    //    //}
        //    //    string strType = DBConfig.GetSystemType(item.DataType);
        //    //    if (strType == "string")
        //    //        sb.AppendLine("\t\t" + "model." + item.ColumnName + " = context.Request[\"" + item.ColumnName.ToLower() + "\"];");
        //    //    else
        //    //        sb.AppendLine("\t\t" + "model." + item.ColumnName + " = " + strType + ".Parse(context.Request[\"" + item.ColumnName.ToLower() + "\"]);");
        //    //}

        //    sb.AppendLine("\t\tbool isTrue = false;");
        //    sb.AppendLine("\t\tif (model.ID == 0)");
        //    sb.AppendLine("\t\t{");
        //    sb.AppendLine("\t\t\tisTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Insert(model); ");
        //    sb.AppendLine("\t\t}");
        //    sb.AppendLine("\t\telse");
        //    sb.AppendLine("\t\t{");
        //    sb.AppendLine("\t\t\tisTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Update(model); ");
        //    sb.AppendLine("\t\t}");
        //    sb.AppendLine("\t\tcontext.Response.Write(isTrue.ToString());");
        //    sb.AppendLine("\t}");
        //    return sb.ToString();
        //}

        private static string CreateDeleteFunction(string strNamespace, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("\t\t/// <summary>");
            sb.AppendLine("\t\t/// DELETE api/<controller>/5");
            sb.AppendLine("\t\t/// </summary>");
            sb.AppendLine("\t\t[HttpGet]");
            sb.AppendLine("\t\tpublic bool Remove(int id)");
            sb.AppendLine("\t\t{");           
            sb.AppendLine("\t\t\tbool isTrue = new " + strNamespace + ".Data.DbAccess." + tableName + "().Delete(id); ");
            sb.AppendLine("\t\t\treturn isTrue;");
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
