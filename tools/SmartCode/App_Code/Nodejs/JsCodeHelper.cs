using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using WebMatrix.Data;

namespace WebMatrixCode.Nodejs
{
    public class JsCodeHelper
    {
        public static void CreateJSFile(string tableName, IEnumerable<dynamic> columnList, string strPath)
        {

                StringBuilder sb = new StringBuilder();


                sb.AppendLine(CreateGetListFunction(columnList, tableName));
                sb.AppendLine(CreateGetRecordFunction(columnList, tableName));
                sb.AppendLine(CreateAddFunction(columnList, tableName));
                sb.AppendLine(CreateDeleteFunction(tableName));
                sb.AppendLine(CreateModalFunction());
                sb.AppendLine(CreateClearFunction(columnList, tableName));

            WriteFile(strPath + "\\public\\javascripts", tableName, sb.ToString());

        }

        private static string CreateGetListFunction(IEnumerable<dynamic> columnList, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("var displayNumber = 20;");
            sb.AppendLine("//获取记录列表");
            sb.AppendLine("function get_list(pageIndex){");
            sb.AppendLine("\tvar data_format = {");
            sb.AppendLine("\t\tpageindex : pageIndex,");
            sb.AppendLine("\t\tpagesize : displayNumber,");
            sb.AppendLine("\t\tr:Math.random()");
            sb.AppendLine("\t};");
            sb.AppendLine();
            sb.AppendLine("\t$.ajax({");
            sb.AppendLine("\t\turl : \"/" + tableName.ToLower() + "/list\",");
            sb.AppendLine("\t\ttype : \"GET\",");
            sb.AppendLine("\t\tdataType : \"json\",");
            sb.AppendLine("\t\tdata : data_format,");
            sb.AppendLine("\t\tbeforeSend : function() { $(\"#loading\").show(); },");
            sb.AppendLine("\t\tcomplete : function() { $(\"#loading\").hide(); },");
            sb.AppendLine("\t\tsuccess : function(json) {");
            sb.AppendLine("\t\t\t$(\"#tt tbody\").find(\"tr.newrow\").remove();");
            sb.AppendLine("\t\t\t//显示记录");
            sb.AppendLine("\t\t\t$.each(json.Data, function(i, item) {");
            sb.AppendLine("\t\t\t\t$(\"<tr class='newrow'></tr>\").append(");

            foreach (var item in columnList)
            {
                string strColumn = item.ColumnName;
                sb.AppendLine("\t\t\t\t\t\"<td>\" + item." + strColumn + "+ \"</td>\" + ");
            }
            sb.AppendLine("\t\t\t\t\t\"<td><a href='#' onclick='get_record(\"+item.ID+\")'><i title='查看' class='fa fa-list'></i></a>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href='#' onclick='delete_record(\"+item.ID+\")'><i title='删除' class='fa fa-remove'></i></a></td>\"");
            sb.AppendLine("\t\t\t\t).appendTo($(\"#tt tbody\"));");
            sb.AppendLine("\t\t\t});");
            sb.AppendLine("\t\t\tif (!$(\"#Pagination\").html()) {");
            sb.AppendLine("\t\t\t\t$(\"#Pagination\").page({ total: json.TotolRecord, pageSize : displayNumber }).on(\"pageClicked\", function (event, pageIndex) { get_list(pageIndex+1); });");
            sb.AppendLine("\t\t\t}");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t});");
            sb.AppendLine("}");
           

            return sb.ToString();
        }

        private static string CreateGetRecordFunction(IEnumerable<dynamic> columnList, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("//获取记录信息");
            sb.AppendLine("function get_record(id){");
            sb.AppendLine("\tvar data_format = {");           
            sb.AppendLine("\t\tid : id");
            sb.AppendLine("\t};");
            sb.AppendLine();
            sb.AppendLine("\t$.ajax({");
            sb.AppendLine("\t\turl : \"/" + tableName.ToLower() + "/single\",");
            sb.AppendLine("\t\ttype : \"GET\",");
            sb.AppendLine("\t\tdataType : \"json\",");
            sb.AppendLine("\t\tdata : data_format,");
            sb.AppendLine("\t\tbeforeSend : function() { $(\"#loading\").show(); },");
            sb.AppendLine("\t\tcomplete : function() { $(\"#loading\").hide(); },");
            sb.AppendLine("\t\tsuccess : function(json) {");
            sb.AppendLine("\t\t\t//显示记录");

            string strColumn = string.Empty;
            foreach (var item in columnList)
            {
                strColumn = item.ColumnName;
                sb.AppendLine("\t\t\t$(\"#txt" + strColumn + "\").val(json." + strColumn + ")");
            }
            sb.AppendLine("\t\t\t$(\"#mod_info\").modal({ backdrop: 'static', keyboard: false });");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

            return sb.ToString();
        }

        private static string CreateAddFunction(IEnumerable<dynamic> columnList, string tableName)
        {         
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("//添加记录信息");
            sb.AppendLine("function set_record(){");
            sb.AppendLine("\tvar data_format = { ");            

            int index = 0;
            int count = columnList.Count();
            foreach (var item in columnList)
            {
                index++;
                string strColumn = item.ColumnName;
                if (index < count)
                    sb.AppendLine("\t\t" + strColumn.ToLower() + " : " + "$(\"#txt" + strColumn + "\").val(),");
                else
                    sb.AppendLine("\t\t" + strColumn.ToLower() + " : " + "$(\"#txt" + strColumn + "\").val()");
            }
            sb.AppendLine("\t};");
            sb.AppendLine();
            sb.AppendLine("\t$.ajax({");
            sb.AppendLine("\t\turl : \"/" + tableName.ToLower() + "\",");
            sb.AppendLine("\t\ttype : \"POST\",");
            sb.AppendLine("\t\tdataType : \"json\",");
            sb.AppendLine("\t\tdata : data_format,");
            sb.AppendLine("\t\tbeforeSend : function() { $(\"#loading\").show(); },");
            sb.AppendLine("\t\tcomplete : function() { $(\"#loading\").hide(); },");
            sb.AppendLine("\t\tsuccess : function(value) {");
            sb.AppendLine("\t\t\tif (!value) {");
            sb.AppendLine("\t\t\t\tbootbox.alert(hint.save_fail);");
            sb.AppendLine("\t\t\t\treturn;");
            sb.AppendLine("\t\t\t}");
            sb.AppendLine("\t\t\t$(\"#mod_info\").modal('hide');");
            sb.AppendLine("\t\t\tbootbox.alert(hint.save_success, function () { ");
            sb.AppendLine("\t\t\t\t$(\"#Pagination\").page('destroy'); ");
            sb.AppendLine("\t\t\t\tget_list(1); ");
            sb.AppendLine("\t\t\t});");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t});");
            sb.AppendLine("}");


            return sb.ToString();
        }

        private static string CreateDeleteFunction(string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("//删除记录信息");
            sb.AppendLine("function delete_record(id){");
            sb.AppendLine("\tbootbox.setLocale(\"zh_CN\");");
            sb.AppendLine("\tbootbox.confirm({");
            sb.AppendLine("\t\ttitle:hint.box_title,");
            sb.AppendLine("\t\tmessage:hint.confirm_delete,");
            sb.AppendLine("\t\tcallback:function (result) {");
            sb.AppendLine("\t\t\tif (!result) return;");
            sb.AppendLine("\t\t\tvar data_format = {");
            sb.AppendLine("\t\t\t\tid : id");
            sb.AppendLine("\t\t\t};");
            sb.AppendLine();
            sb.AppendLine("\t\t\t$.ajax({");
            sb.AppendLine("\t\t\t\turl : \"/" + tableName.ToLower() + "\",");
            sb.AppendLine("\t\t\t\ttype : \"DELETE\",");
            sb.AppendLine("\t\t\t\tdataType : \"json\",");
            sb.AppendLine("\t\t\t\tdata : data_format,");
            sb.AppendLine("\t\t\t\tbeforeSend : function() { $(\"#loading\").show(); },");
            sb.AppendLine("\t\t\t\tcomplete : function() { $(\"#loading\").hide(); },");
            sb.AppendLine("\t\t\t\tsuccess : function(value) {");
            sb.AppendLine("\t\t\t\t\tif (!value) {");
            sb.AppendLine("\t\t\t\t\t\tbootbox.alert(hint.delete_fail);");
            sb.AppendLine("\t\t\t\t\t\treturn;");
            sb.AppendLine("\t\t\t\t\t}");
            sb.AppendLine("\t\t\t\t\tbootbox.alert(hint.delete_success, function () { ");
            sb.AppendLine("\t\t\t\t\t\t$(\"#Pagination\").page('destroy'); ");
            sb.AppendLine("\t\t\t\t\t\tget_list(1); ");
            sb.AppendLine("\t\t\t\t\t});");
            sb.AppendLine("\t\t\t\t}");
            sb.AppendLine("\t\t\t});");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t});");
            sb.AppendLine("}");

            return sb.ToString();
        }

        private static string CreateModalFunction()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("//弹出Modal");
            sb.AppendLine("function show_modal(){");
            sb.AppendLine("\tclear_control();");
            sb.AppendLine("\t$(\"#mod_info\").modal({ backdrop: 'static', keyboard: false });");
            sb.AppendLine("}");
            return sb.ToString();
        }

        private static string CreateClearFunction(IEnumerable<dynamic> columnList, string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("//获取记录信息");
            sb.AppendLine("function clear_control(){");
            string strColumn = string.Empty;
            
            foreach (var item in columnList)
            {
                strColumn = item.ColumnName;
                sb.AppendLine("\t$(\"#txt" + strColumn + "\").val(\"\");");
            }
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

            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
