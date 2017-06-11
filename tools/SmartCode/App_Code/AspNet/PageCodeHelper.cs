using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using WebMatrix.Data;

namespace WebMatrixCode.AspNet
{
    public class PageCodeHelper
    {
        public static void CreatePageFile(string tableName, List<TableDesc> columns, string strPath)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(CreateViewPage(tableName, columns));
            //WriteFile(strPath + "\\Views", tableName+"_List", sb.ToString());
            WriteFile(strPath + "\\Views", tableName, sb.ToString());

            //sb = new StringBuilder();
            //sb.AppendLine(CreateEditPage(db, dbConfig, tableName));
            //WriteFile(strPath + "\\Views", tableName+"_Edit", sb.ToString());
        }

        private static string CreateViewPage(string tableName, List<TableDesc> columns)
        {
            string path = System.Windows.Forms.Application.StartupPath;
            SmartLib.Common.FileHelper f = new SmartLib.Common.FileHelper();
            string tmpContent = f.ReadFileByTxt(path + "\\config\\AspNet\\aspx.txt");
            tmpContent = tmpContent.Replace("<%=TableName%>", tableName.ToString());

            StringBuilder sb = new StringBuilder();
            //sb.AppendLine("@{");
            //sb.AppendLine("\tLayout = \"~/_SiteLayout.cshtml\";");
            //sb.AppendLine("\tPage.Title = \"" + tableName + "\";");
            //sb.AppendLine("}");

            //sb.AppendLine("<div id=\"loading\" style=\"top: 50%; right: 50%; position: absolute; padding: 0px; margin: 0px; z-index: 999; display: none;\">");
            //sb.AppendLine("\t<img src=\"../Content/images/spinner3-greenie.gif\" alt=\"load_data\" />");
            //sb.AppendLine("</div>");
            //sb.AppendLine("<div class=\"postion\">");
            //sb.AppendLine("\t<span class=\"f_b_blue\">您的当前位置：</span>" + tableName);
            //sb.AppendLine("</div>");
            //sb.AppendLine("<div class=\"cont_f_lb\"></div>");

            //sb.AppendLine("<div id=\"content\">");
            //sb.AppendLine("\t<div style=\"padding:1px;background:#efefef;\" ><a href=\"#\" class=\"easyui-linkbutton\" data-options=\"iconCls:'icon-add'\" onclick=\"add_record();\">新增</a></div>");
            //sb.AppendLine("\t<table id=\"tt\" cellspacing=\"0\" class=\"table_record\">");
            //sb.AppendLine("\t\t<tr>");
            foreach (var item in columns)
            {
                string strColumnName = item.ColumnName;
                string strColumnDesc = item.ColumnDesc;
                sb.AppendLine("\t\t\t<th>" + (!string.IsNullOrEmpty(strColumnDesc) ? strColumnDesc : strColumnName) + "</th> ");
            }
            sb.AppendLine("\t\t\t<th style=\"width:120px;\">操作</th>");
            //sb.AppendLine("\t\t</tr>");
            //sb.AppendLine("\t</table>");
            //sb.AppendLine("\t<div id=\"pp\" class=\"pager\"></div>");
            //sb.AppendLine("</div>");
            tmpContent = tmpContent.Replace("<%=RowHeader%>", sb.ToString());            

            //编辑
            sb = new StringBuilder();
            foreach (var item in columns)
            {
                string strColumnName = item.ColumnName;
                string strColumnDesc = (!string.IsNullOrEmpty(item.ColumnDesc) ? item.ColumnDesc : strColumnName);
                sb.AppendLine("\t<div class=\"form-group\">");
                sb.AppendLine("\t\t<label for=\"txt" + strColumnName + "\">" + strColumnDesc + "</label>");
                sb.AppendLine("\t\t<input type=\"text\" id=\"txt" + strColumnName + "\" name=\"" + strColumnName + "\" class=\"form-control\" placeholder=\"请输入" + strColumnDesc + "\"/>");
                sb.AppendLine("\t</div>");
            }

            tmpContent = tmpContent.Replace("<%=ColumnList%>", sb.ToString());
            return tmpContent;
            //return sb.ToString();
        }

        //private static string CreateEditPage(Database db, DBConfig dbConfig, string tableName)
        //{
        //    StringBuilder sb = new StringBuilder();
        //    sb.AppendLine("@{");
        //    sb.AppendLine("\tLayout = \"~/_SiteLayout.cshtml\";");
        //    sb.AppendLine("\tPage.Title = \"" + tableName + "\";");
        //    sb.AppendLine("}");

        //    sb.AppendLine("<div id=\"loading\" style=\"top: 50%; right: 50%; position: absolute; padding: 0px; margin: 0px; z-index: 999; display: none;\">");
        //    sb.AppendLine("\t<img src=\"../Content/images/spinner3-greenie.gif\" alt=\"load_data\" />");
        //    sb.AppendLine("</div>");
        //    sb.AppendLine("<div class=\"postion\">");
        //    sb.AppendLine("\t<span class=\"f_b_blue\">您的当前位置：</span>" + tableName);
        //    sb.AppendLine("</div>");
        //    sb.AppendLine("<div class=\"cont_f_lb\">");
        //    sb.AppendLine("</div>");

        //    sb.AppendLine("<div id=\"content\">");
            
        //    sb.AppendLine("\t<table id=\"tt\" cellspacing=\"0\" class=\"table_record\">");            
        //    var items = MatrixDataHelper.GetTableColumn(db, tableName, dbConfig.DBType);
        //    foreach (var item in items)
        //    {
        //        string strColumn = item.ColumnName;
        //        sb.AppendLine("\t\t<tr>");
        //        sb.AppendLine("\t\t\t<th>" + strColumn + "</th> ");
        //        sb.AppendLine("\t\t\t<td><input type=\"text\" id=\"txt"+ strColumn +"\" name=\""+ strColumn +"\" value=\"\" /></td>");
        //        sb.AppendLine("\t\t</tr>");
        //    }
        //    sb.AppendLine("\t\t<tr>");
        //    sb.AppendLine("\t\t\t<th colspan=\"2\">");
        //    sb.AppendLine("\t\t\t\t<a href=\"javascirpt:void(0);\" class=\"easyui-linkbutton\" data-options=\"iconCls:'icon-save'\" id=\"btnSave\">保存</a>");
        //    sb.AppendLine("\t\t\t\t<a href=\"javascirpt:void(0);\" class=\"easyui-linkbutton\" id=\"btnCancel\">取消</a>");
        //    sb.AppendLine("\t\t\t</th>");
        //    sb.AppendLine("\t\t</tr>");
        //    sb.AppendLine("\t</table>");          
        //    sb.AppendLine("</div>");

        //    return sb.ToString();
        //}

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
                string sFilePathName = sFilePath + sFileName + ".cshtml";
                File.WriteAllText(sFilePathName, sContent, Encoding.UTF8);

            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
