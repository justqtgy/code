using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Windows.Forms;
using WebMatrix.Data;

namespace WebMatrixCode
{
    public class CodeHelper
    {
        public static void CreateCode(DBHelper.DBType dbType, string connectionString, string strNamespace, string strPath, string projType)
        {
            try
            {
                if (Directory.Exists(strPath)) Directory.Delete(strPath, true);
                string strDataPath = strPath + @"\" + strNamespace + ".Data";
                string strWebPath = strPath + @"\" + strNamespace + ".Web";
                CopyDirectory(Application.StartupPath + "\\Template\\" + projType, strWebPath);

                List<string> tableLists = null;

                if (projType.ToLower() == "nodejs")
                {
                    //创建controller文件
                    Nodejs.ControllerCodeHelper.CreateControllerFiles(dbType, connectionString, strWebPath);
                    //创建view/shared目录（存放导航页面）
                    Nodejs.SidebarCodeHelper.CreatePageFile(dbType, connectionString, strWebPath);

                    tableLists = DBHelper.GetDbTables(dbType, connectionString);
                    foreach (var tableName in tableLists)
                    {
                        List<TableDesc> columnList = DBHelper.GetTableColumn(dbType, connectionString, tableName);

                        //创建js目录
                        Nodejs.JsCodeHelper.CreateJSFile(tableName.ToLower(), columnList, strWebPath);
                        ////创建router目录
                        Nodejs.RoutesCodeHelper.CreateRoutesFiles(tableName.ToLower(), strWebPath);
                        ////创建view目录（存放页面）
                        Nodejs.PageCodeHelper.CreatePageFile(tableName.ToLower(), columnList, strWebPath);
                        ////创建model目录
                        Nodejs.DbCodeHelper.CreateModelFile(tableName.ToLower(), columnList, strWebPath);

                    }
                }
                else
                {
                    //创建view/shared目录（存放导航页面）
                    AspNet.SidebarCodeHelper.CreatePageFile(dbType, connectionString, strWebPath);

                    tableLists = DBHelper.GetDbTables(dbType, connectionString);
                    foreach (var tableName in tableLists)
                    {
                        List<TableDesc> columnList = DBHelper.GetTableColumn(dbType, connectionString, tableName);

                        //创建js目录
                        AspNet.JsCodeHelper.CreateJSFile(tableName, columnList, strWebPath, strNamespace);
                        ////创建router目录
                        AspNet.ControllerCodeHelper.CreateControllerFiles(tableName, columnList, strWebPath, strNamespace);
                        ////创建view目录（存放页面）
                        AspNet.PageCodeHelper.CreatePageFile(tableName, columnList, strWebPath);
                        ////创建model目录
                        AspNet.DbCodeHelper.CreateCSFile(tableName, columnList, strDataPath, strNamespace);

                    }
                }

                MessageHelper.ShowSuccessMessage("代码生成成功");
            }
            catch (Exception ex)
            {
                MessageHelper.ShowErrorMessage(ex.Message);
            }
        }

        /// <summary>
        /// 复制文件夹（及文件夹下所有子文件夹和文件）
        /// </summary>
        /// <param name="sourcePath">待复制的文件夹路径</param>
        /// <param name="destinationPath">目标路径</param>
        public static void CopyDirectory(String sourcePath, String destinationPath)
        {
            DirectoryInfo info = new DirectoryInfo(sourcePath);
            Directory.CreateDirectory(destinationPath);
            foreach (FileSystemInfo fsi in info.GetFileSystemInfos())
            {
                String destName = Path.Combine(destinationPath, fsi.Name);

                if (fsi is System.IO.FileInfo)          //如果是文件，复制文件
                    File.Copy(fsi.FullName, destName);
                else                                    //如果是文件夹，新建文件夹，递归
                {
                    Directory.CreateDirectory(destName);
                    CopyDirectory(fsi.FullName, destName);
                }
            }
        }
    }
}
