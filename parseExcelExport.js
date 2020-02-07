module.exports = (function() {
  return (file) => {
    const fs = require('fs'),
      path = require('path'),
      filePath=(__dirname, file)

    const text = fs.readFileSync(filePath, {encoding: 'utf-8'})
    const json = JSON.parse(text)
    return json.Tabelle1
      .map(row => {
        return Object.keys(row).map(columnName => {
          if (columnName.includes("Blacklist") || columnName.includes("Disavow")) {
            const reason = columnName.includes("Blacklist") ? "Blacklist" : "Disavow"
            return [row[columnName], 1, reason]
          }
          return [row[columnName], 0, null]
        })
      })
      .reduce((acc, current) => {
        return acc.concat(current)
      }, [])
  }
})()