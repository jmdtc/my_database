module.exports = ( () => {
  return (arr, columns) => {
    return arr.map((row) => {
      return row.map((value, i) => {
        return {[columns[i]]: value}
      })
    })
  }
})()
