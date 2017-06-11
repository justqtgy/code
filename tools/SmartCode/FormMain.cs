using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Xml;
using WebMatrix.Data;

namespace WebMatrixCode
{
    public partial class FormMain : Form
    {
        XmlHelper xml = null; 
        string xmlPath = string.Empty;
        
        string connectionString = string.Empty;
        DBHelper.DBType dbType = DBHelper.DBType.SqlServer;


        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            xmlPath = Application.StartupPath + "\\db.xml";
            xml = new XmlHelper(xmlPath);
            cmbDbType.SelectedIndex = 0;
        }

        private void btnOpen_Click(object sender, EventArgs e)
        {
            try
            {
                connectionString = txtConnString.Text;

                List<string> lists = null;
                dbType = (DBHelper.DBType)Enum.Parse(typeof(DBHelper.DBType), cmbDbType.Text);
                lists = DBHelper.GetDbTables(dbType, connectionString);
              
                lvTable.Items.Clear();
                foreach (var table in lists)
                {
                    ListViewItem item = new ListViewItem();
                    item.ImageIndex = 2;
                    item.SubItems[0].Text = table;
                    item.SubItems.Add("Table");
                    lvTable.Items.Add(item);              
                }
            }
            catch (Exception ex)
            {
                MessageHelper.ShowErrorMessage(ex.Message);
            }
        }

        private void SaveDBConnectionXml()
        {
            string strDbType = cmbDbType.Text;
            if (!string.IsNullOrEmpty(strDbType))
            {
                xml.Replace(string.Format("/DBConnections/DBConnection/{0}", strDbType), txtConnString.Text);
            }            
        }

        private void cmbDbType_SelectedIndexChanged(object sender, EventArgs e)
        {
            string strDbType = cmbDbType.Text;
            if(!string.IsNullOrEmpty(strDbType))
            {
                string strConnection = xml.Read(string.Format("/DBConnections/DBConnection/{0}", strDbType), "");
                this.txtConnString.Text = strConnection;
            }            
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            try
            {
                SaveDBConnectionXml();
                MessageHelper.ShowSuccessMessage("保存设置成功");
            }
            catch (Exception ex)
            {
                MessageHelper.ShowErrorMessage(ex.Message);
            }
        }

        private void btnBuild_Click(object sender, EventArgs e)
        {
            string strPath = txtTablePath.Text;
            string strNamespace = txtNamespace.Text;
            string projType = rdbtnAspNet.Checked ? "AspNet" : "Nodejs";
            
            CodeHelper.CreateCode(dbType, connectionString, strNamespace, strPath, projType);
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

        private void lvTable_Click(object sender, EventArgs e)
        {
            List<TableDesc> columns = null;

            string strTable = lvTable.SelectedItems[0].Text; 
            columns = DBHelper.GetTableColumn(dbType,connectionString, strTable);           
            
            int index = 0;
            lvColumn.Items.Clear();
            foreach (var column in columns)
            {
                index++;
                ListViewItem item = new ListViewItem();
                item.SubItems[0].Text = index.ToString();
                item.SubItems.Add(column.ColumnName);
                item.SubItems.Add(column.DataType);
                lvColumn.Items.Add(item);
            }
        }

        private void rdBtnNodejs_CheckedChanged(object sender, EventArgs e)
        {
            txtNamespace.Enabled = false;
        }

        private void rdBtnAspNet_CheckedChanged(object sender, EventArgs e)
        {
            txtNamespace.Enabled = true;
        }
    }
}
