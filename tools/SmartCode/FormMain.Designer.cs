namespace WebMatrixCode
{
    partial class FormMain
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormMain));
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.rdbtnNodejs = new System.Windows.Forms.RadioButton();
            this.rdbtnAspNet = new System.Windows.Forms.RadioButton();
            this.label3 = new System.Windows.Forms.Label();
            this.txtNamespace = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.btnBuild = new System.Windows.Forms.Button();
            this.btnTablePath = new System.Windows.Forms.Button();
            this.txtTablePath = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.txtConnString = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.cmbDbType = new System.Windows.Forms.ComboBox();
            this.labMsg = new System.Windows.Forms.Label();
            this.btnOpen = new System.Windows.Forms.Button();
            this.label7 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.btnSave = new System.Windows.Forms.Button();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.lvTable = new System.Windows.Forms.ListView();
            this.columnHeader1 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader2 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.lvColumn = new System.Windows.Forms.ListView();
            this.columnHeader3 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader4 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader5 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.rdbtnNodejs);
            this.groupBox1.Controls.Add(this.rdbtnAspNet);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.txtNamespace);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.btnBuild);
            this.groupBox1.Controls.Add(this.btnTablePath);
            this.groupBox1.Controls.Add(this.txtTablePath);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(15, 137);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(818, 146);
            this.groupBox1.TabIndex = 7;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "生成代码路径";
            // 
            // rdbtnNodejs
            // 
            this.rdbtnNodejs.AutoSize = true;
            this.rdbtnNodejs.Checked = true;
            this.rdbtnNodejs.Location = new System.Drawing.Point(262, 30);
            this.rdbtnNodejs.Name = "rdbtnNodejs";
            this.rdbtnNodejs.Size = new System.Drawing.Size(59, 16);
            this.rdbtnNodejs.TabIndex = 8;
            this.rdbtnNodejs.TabStop = true;
            this.rdbtnNodejs.Text = "Nodejs";
            this.rdbtnNodejs.UseVisualStyleBackColor = true;
            // 
            // rdbtnAspNet
            // 
            this.rdbtnAspNet.AutoSize = true;
            this.rdbtnAspNet.Location = new System.Drawing.Point(115, 30);
            this.rdbtnAspNet.Name = "rdbtnAspNet";
            this.rdbtnAspNet.Size = new System.Drawing.Size(59, 16);
            this.rdbtnAspNet.TabIndex = 7;
            this.rdbtnAspNet.Text = "AspNet";
            this.rdbtnAspNet.UseVisualStyleBackColor = true;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(27, 32);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(53, 12);
            this.label3.TabIndex = 6;
            this.label3.Text = "项目类型";
            // 
            // txtNamespace
            // 
            this.txtNamespace.Location = new System.Drawing.Point(115, 68);
            this.txtNamespace.Name = "txtNamespace";
            this.txtNamespace.Size = new System.Drawing.Size(242, 21);
            this.txtNamespace.TabIndex = 5;
            this.txtNamespace.Text = "SmartHome";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(27, 73);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(53, 12);
            this.label2.TabIndex = 4;
            this.label2.Text = "命名空间";
            // 
            // btnBuild
            // 
            this.btnBuild.Location = new System.Drawing.Point(717, 66);
            this.btnBuild.Name = "btnBuild";
            this.btnBuild.Size = new System.Drawing.Size(75, 23);
            this.btnBuild.TabIndex = 3;
            this.btnBuild.Text = "生成代码";
            this.btnBuild.UseVisualStyleBackColor = true;
            this.btnBuild.Click += new System.EventHandler(this.btnBuild_Click);
            // 
            // btnTablePath
            // 
            this.btnTablePath.Location = new System.Drawing.Point(761, 105);
            this.btnTablePath.Name = "btnTablePath";
            this.btnTablePath.Size = new System.Drawing.Size(31, 23);
            this.btnTablePath.TabIndex = 1;
            this.btnTablePath.Text = "...";
            this.btnTablePath.UseVisualStyleBackColor = true;
            // 
            // txtTablePath
            // 
            this.txtTablePath.Location = new System.Drawing.Point(115, 107);
            this.txtTablePath.Name = "txtTablePath";
            this.txtTablePath.Size = new System.Drawing.Size(630, 21);
            this.txtTablePath.TabIndex = 1;
            this.txtTablePath.Text = "E:\\SmartHome";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(27, 112);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(77, 12);
            this.label1.TabIndex = 0;
            this.label1.Text = "文件保存路径";
            // 
            // txtConnString
            // 
            this.txtConnString.Location = new System.Drawing.Point(115, 77);
            this.txtConnString.Name = "txtConnString";
            this.txtConnString.Size = new System.Drawing.Size(633, 21);
            this.txtConnString.TabIndex = 2;
            this.txtConnString.Text = "Server=192.168.1.246\\SQL2008;database=JBL_NYCS;uid=sa;pwd=soholife123";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(30, 37);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(65, 12);
            this.label5.TabIndex = 1;
            this.label5.Text = "数据库类型";
            // 
            // cmbDbType
            // 
            this.cmbDbType.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cmbDbType.FormattingEnabled = true;
            this.cmbDbType.Items.AddRange(new object[] {
            "SqlServer",
            "MySql"});
            this.cmbDbType.Location = new System.Drawing.Point(115, 35);
            this.cmbDbType.Name = "cmbDbType";
            this.cmbDbType.Size = new System.Drawing.Size(121, 20);
            this.cmbDbType.TabIndex = 10;
            this.cmbDbType.SelectedIndexChanged += new System.EventHandler(this.cmbDbType_SelectedIndexChanged);
            // 
            // labMsg
            // 
            this.labMsg.AutoSize = true;
            this.labMsg.Font = new System.Drawing.Font("宋体", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.labMsg.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.labMsg.Location = new System.Drawing.Point(236, 157);
            this.labMsg.Name = "labMsg";
            this.labMsg.Size = new System.Drawing.Size(0, 12);
            this.labMsg.TabIndex = 9;
            // 
            // btnOpen
            // 
            this.btnOpen.Location = new System.Drawing.Point(629, 32);
            this.btnOpen.Name = "btnOpen";
            this.btnOpen.Size = new System.Drawing.Size(75, 23);
            this.btnOpen.TabIndex = 4;
            this.btnOpen.Text = "打开数据库";
            this.btnOpen.UseVisualStyleBackColor = true;
            this.btnOpen.Click += new System.EventHandler(this.btnOpen_Click);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(30, 80);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(65, 12);
            this.label7.TabIndex = 3;
            this.label7.Text = "链接字符串";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.btnSave);
            this.groupBox2.Controls.Add(this.cmbDbType);
            this.groupBox2.Controls.Add(this.labMsg);
            this.groupBox2.Controls.Add(this.btnOpen);
            this.groupBox2.Controls.Add(this.label7);
            this.groupBox2.Controls.Add(this.txtConnString);
            this.groupBox2.Controls.Add(this.label5);
            this.groupBox2.Location = new System.Drawing.Point(15, 12);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(818, 119);
            this.groupBox2.TabIndex = 8;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "数据库链接";
            // 
            // btnSave
            // 
            this.btnSave.Location = new System.Drawing.Point(717, 32);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(75, 23);
            this.btnSave.TabIndex = 11;
            this.btnSave.Text = "保存配置";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.lvTable);
            this.groupBox3.Location = new System.Drawing.Point(15, 289);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(404, 278);
            this.groupBox3.TabIndex = 12;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "数据库表";
            // 
            // lvTable
            // 
            this.lvTable.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader1,
            this.columnHeader2});
            this.lvTable.Dock = System.Windows.Forms.DockStyle.Fill;
            this.lvTable.Location = new System.Drawing.Point(3, 17);
            this.lvTable.Name = "lvTable";
            this.lvTable.Size = new System.Drawing.Size(398, 258);
            this.lvTable.SmallImageList = this.imageList1;
            this.lvTable.StateImageList = this.imageList1;
            this.lvTable.TabIndex = 11;
            this.lvTable.UseCompatibleStateImageBehavior = false;
            this.lvTable.View = System.Windows.Forms.View.Details;
            this.lvTable.Click += new System.EventHandler(this.lvTable_Click);
            // 
            // columnHeader1
            // 
            this.columnHeader1.Text = "名称";
            this.columnHeader1.Width = 130;
            // 
            // columnHeader2
            // 
            this.columnHeader2.Text = "类型";
            // 
            // imageList1
            // 
            this.imageList1.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList1.ImageStream")));
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
            this.imageList1.Images.SetKeyName(0, "database.gif");
            this.imageList1.Images.SetKeyName(1, "folder.gif");
            this.imageList1.Images.SetKeyName(2, "table.gif");
            this.imageList1.Images.SetKeyName(3, "field.gif");
            this.imageList1.Images.SetKeyName(4, "key.gif");
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.lvColumn);
            this.groupBox4.Location = new System.Drawing.Point(425, 289);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(408, 275);
            this.groupBox4.TabIndex = 13;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "表结构";
            // 
            // lvColumn
            // 
            this.lvColumn.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader3,
            this.columnHeader4,
            this.columnHeader5});
            this.lvColumn.Dock = System.Windows.Forms.DockStyle.Fill;
            this.lvColumn.Location = new System.Drawing.Point(3, 17);
            this.lvColumn.Name = "lvColumn";
            this.lvColumn.Size = new System.Drawing.Size(402, 255);
            this.lvColumn.TabIndex = 12;
            this.lvColumn.UseCompatibleStateImageBehavior = false;
            this.lvColumn.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader3
            // 
            this.columnHeader3.Text = "ID";
            this.columnHeader3.Width = 43;
            // 
            // columnHeader4
            // 
            this.columnHeader4.Text = "字段";
            this.columnHeader4.Width = 109;
            // 
            // columnHeader5
            // 
            this.columnHeader5.Text = "类型";
            this.columnHeader5.Width = 64;
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(850, 579);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.groupBox2);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "FormMain";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "WebMatrix自动代码";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox4.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.TextBox txtNamespace;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button btnBuild;
        private System.Windows.Forms.Button btnTablePath;
        private System.Windows.Forms.TextBox txtTablePath;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txtConnString;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.ComboBox cmbDbType;
        private System.Windows.Forms.Label labMsg;
        private System.Windows.Forms.Button btnOpen;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.ListView lvTable;
        private System.Windows.Forms.ColumnHeader columnHeader1;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.ListView lvColumn;
        private System.Windows.Forms.ColumnHeader columnHeader3;
        private System.Windows.Forms.ColumnHeader columnHeader4;
        private System.Windows.Forms.ColumnHeader columnHeader5;
        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.RadioButton rdbtnNodejs;
        private System.Windows.Forms.RadioButton rdbtnAspNet;
    }
}

