using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebMatrix.Data;

public class DatabaseHelper
{
    internal Database db = null;

    public DatabaseHelper()
    {
        db = Database.Open("conn");
    }
}

