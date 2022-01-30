using System;
using System.Data.SQLite;

namespace PanchoBot; 

public static class Database {
    public static SQLiteConnection CreateConnection(string databaseName) {
        // Create a new database connection:
        // Open the connection:
        var sqLiteConnection = new SQLiteConnection($"Data Source={databaseName}.sqlite; Version = 3; New = True; Compress = True;");
        try {
            sqLiteConnection.Open();
        }
        catch (Exception ex) {
            Console.WriteLine(ex.ToString());
        }

        return sqLiteConnection;
    }

    public static void CreateTable(SQLiteConnection sqLiteConnection) {
        var createSql = "CREATE TABLE SampleTable(Col1 VARCHAR(20), Col2 INT)";
        var createSql1 = "CREATE TABLE SampleTable1(Col1 VARCHAR(20), Col2 INT)";

        var sqLiteCommand = sqLiteConnection.CreateCommand();
        sqLiteCommand.CommandText = createSql;
        sqLiteCommand.ExecuteNonQuery();
        sqLiteCommand.CommandText = createSql1;
        sqLiteCommand.ExecuteNonQuery();
    }

    public static void InsertData(SQLiteConnection sqLiteConnection) {
        var sqLiteCommand = sqLiteConnection.CreateCommand();

        sqLiteCommand.CommandText = "INSERT INTO SampleTable(Col1, Col2) VALUES ('Test Text ', 1);";
        sqLiteCommand.ExecuteNonQuery();
        sqLiteCommand.CommandText = "INSERT INTO SampleTable(Col1, Col2) VALUES ('Test1 Text1 ', 2);";
        sqLiteCommand.ExecuteNonQuery();
        sqLiteCommand.CommandText = "INSERT INTO SampleTable(Col1, Col2) VALUES ('Test2 Text2 ', 3);";
        sqLiteCommand.ExecuteNonQuery();


        sqLiteCommand.CommandText = "INSERT INTO SampleTable1(Col1, Col2) VALUES ('Test3 Text3 ', 3);";
        sqLiteCommand.ExecuteNonQuery();
    }

    public static void ReadData(SQLiteConnection sqLiteConnection) {
        var sqLiteCommand = sqLiteConnection.CreateCommand();
        sqLiteCommand.CommandText = "SELECT * FROM SampleTable";

        var sqLiteDataReader = sqLiteCommand.ExecuteReader();
        while (sqLiteDataReader.Read()) {
            var myReader = sqLiteDataReader.GetString(0);
            Console.WriteLine(myReader);
        }

        sqLiteConnection.Close();
    }
}