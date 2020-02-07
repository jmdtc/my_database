const LrtClient = require('./LrtClient')
const sqlite3 = require('sqlite3').verbose()
const mapToColumns = require('./mapToColumns')
const parseExcel = require('./parseExcelExport.js')


// init project
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/test", async function (request, response) {
  const lrtClient = new LrtClient(process.env.LRT_KEY)
  const ans = await lrtClient.getReportData("12849501")
  //console.log(ans.report.pages)
  const values = ans.report.pages.data
  const columns = ans.report.pages.columns
  const test = mapToColumns(values, columns)
  /*const test = values.map((row) => {
    return row.map((value, i) => {
      return {[columns[i]]: value}
    })
  }) */
  console.log(test)
  //console.log(ans.value_names.list)
  /*const {reports} = reportList
  const data = await lrtClient.getReportData(reports[0].report_id)
  console.log(data)
  response.send(data) */
});


app.get("/DB", async (request, response) => {
  let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  
  db.serialize(() => {
    
    const schema = "CREATE TABLE IF NOT EXISTS domains (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, domain_name TEXT NOT NULL UNIQUE, blacklist INTEGER NOT NULL DEFAULT 0, blacklist_reason TEXT, ip_country TEXT,lrt_theme TEXT,lrt_sitetype TEXT,homepage_title TEXT,homepage_title_rank INTEGER,lrt_power INTEGER,lrt_trust INTEGER,lrt_power_trust INTEGER,lrt_backlinks INTEGER,lrt_referring_domains INTEGER,semrush_traffic INTEGER);"
    db.run(schema)
    
    const insertDomain = db.prepare(`INSERT INTO domains(domain_name, blacklist, blacklist_reason) VALUES(?,?,?)`);
    const files = ["fr_de_uk_blacklist.txt", "fi_it_nl_blacklist.txt", "disavow.txt", "just_french.txt",]
    
    files.forEach(file => {
      parseExcel(file).forEach((domain) => {
        insertDomain.run(domain, function(err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`A row has been inserted with rowid ${this.lastID}`);
        })
      })
    })
    
    insertDomain.finalize()
    
    db.all("SELECT * FROM domains", (err, rows) => {
      console.log("\n")
      console.log(rows)
    })
  })
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
})


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

