using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebMatrixCode
{
    public class MessageHelper
    {
         /// <summary>
        /// 显示错误信息提示框
        /// </summary>
        /// <param name="text">信息内容</param>
        public static void ShowErrorMessage(string text)
        {
            MessageBox.Show(text, "提示", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        /// <summary>
        /// 显示警告信息提示框
        /// </summary>
        /// <param name="text">信息内容</param>
        public static void ShowWarningMessage(string text)
        {
            MessageBox.Show(text, "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        /// <summary>
        /// 显示成功信息提示框
        /// </summary>
        /// <param name="text">信息内容</param>
        public static void ShowSuccessMessage(string text)
        {
            MessageBox.Show(text, "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        /// <summary>
        /// 显示确认信息提示框
        /// </summary>
        /// <param name="text">信息内容</param>
        public static bool ShowQuestionMessage(string text)
        {
            bool result = false;
            if (MessageBox.Show(text, "提示", MessageBoxButtons.OKCancel, MessageBoxIcon.Question) == DialogResult.OK)
                result = true;
            return result;
        }
    }
}
