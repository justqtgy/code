using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace WebMatrixCode.Nodejs
{
    public class RoutesCodeHelper
    {
        public static void CreateRoutesFiles(string tableName, string strPath)
        {
                string strUsing = "var express = require('express');\r\nvar router = express.Router();";
                StringBuilder sb = new StringBuilder();
                sb.AppendLine(strUsing);
                sb.AppendLine();

                sb.AppendLine("var " + tableName.ToLower() + " = require('../models/" + tableName + "');");
                sb.AppendLine();
                sb.AppendLine(CreateRenderFunction(tableName));
                sb.AppendLine(CreateGetCountFunction(tableName));
                sb.AppendLine(CreateGetListFunction(tableName));
                sb.AppendLine(CreateGetRecordFunction(tableName));
                sb.AppendLine(CreatePostFunction(tableName));
                // sb.AppendLine(CreatePutFunction(db, dbConfig, strNamespace, tableName));
                sb.AppendLine(CreateDeleteFunction(tableName));
                sb.AppendLine("module.exports = router;");

                WriteFile(strPath + "\\routes", tableName, sb.ToString());
        }

        private static string CreateRenderFunction(string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("router.get('/', function(req, res, next) {");
            sb.AppendLine("\tres.render('" + tableName.ToLower() + "');");
            sb.AppendLine("});");

            return sb.ToString();
        }

        private static string CreateGetCountFunction(string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("var get_count = function(req, res, next) {");
            sb.AppendLine("\t" + tableName.ToLower() + ".get_count(function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\treturn next(err);");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\treq.total = result;");
            sb.AppendLine("\t\tnext();");
            sb.AppendLine("\t});");
            sb.AppendLine("};");

            return sb.ToString();
        }

        private static string CreateGetListFunction(string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("router.get('/list', [get_count], function(req, res, next) {");
            sb.AppendLine("\tvar args = req.body;");
            sb.AppendLine("\t" + tableName.ToLower() + ".get_list(args, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\tres.send({ ok : 0, msg : err });");
            sb.AppendLine("\t\t\treturn;");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tres.send({ ok : 1, total : req.total, rows : result });");
            sb.AppendLine("\t});");
            sb.AppendLine("});");

            return sb.ToString();
        }

        private static string CreateGetRecordFunction(string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("router.get('/single', function(req, res, next) {");
            sb.AppendLine("\tvar id = req.query.id;");
            sb.AppendLine("\t" + tableName.ToLower() + ".get_single(id, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\tres.send({ ok : 0, msg : err });");
            sb.AppendLine("\t\t\treturn;");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tres.send({ ok : 1, rows : result });");
            sb.AppendLine("\t});");
            sb.AppendLine("});");

            return sb.ToString();
        }

        private static string CreatePostFunction(string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("router.post('/', function(req, res, next) {");
            //sb.AppendLine("\tvar model = new " + tableName + "({");
            sb.AppendLine("\tvar args = req.body");

            sb.AppendLine("\t" + tableName.ToLower() + ".add(args, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\tres.send({ ok : 0, msg : err });");
            sb.AppendLine("\t\t\treturn;");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tres.send({ ok : 1 });");
            sb.AppendLine("\t});");
            sb.AppendLine("});");

            return sb.ToString();
        }

        private static string CreateDeleteFunction(string tableName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("router.delete('/', function(req, res, next) {");
            sb.AppendLine("\tvar id = req.body.id;");
            sb.AppendLine("\t" + tableName.ToLower() + ".delete(id, function(err, result){");
            sb.AppendLine("\t\tif(err){");
            sb.AppendLine("\t\t\tres.send({ ok : 0, msg : err });");
            sb.AppendLine("\t\t\treturn;");
            sb.AppendLine("\t\t}");
            sb.AppendLine("\t\tres.send({ ok : 1 });");
            sb.AppendLine("\t});");
            sb.AppendLine("});");

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
