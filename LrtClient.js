const requestP = require("request-promise");

module.exports = class LrtClient {
  constructor(api_key) {
    this.api_key = api_key
    this.base = "https://app.linkresearchtools.com/toolkit/api.php?"
  }

  queryEncode(params) {
    return Object.keys(params)
    .map(key => {
      if (Array.isArray(params[key])) {
        return params[key]
          .map((k,i) => {
            return encodeURI(`${key}[${i}]=${params[key][i]}`)
          })
          .join("&")
      }
      return encodeURI(`${key}=${params[key]}`)
    })
    .join("&")
  }
  
  fetchAPI(action, params = {}) {
    params.api_key = this.api_key
    params.action = action
    const options = {
      uri: this.base + this.queryEncode(params),
      json: true
    }
    
    return requestP(options)
      .then(res => {return res})
      .catch(err => console.log(err))
  }
  
  createReport(
    urls,
    values = [
      "Power-dom", "Trust-dom", "Power*Trust dom", "BLdom", "DomPop", "Theme", "SiteType",
      "KwDomain", "Title-home", "TitleRank-home", "SEMRushRank", "SEMRushPrice", "SEMRushTraffic", "CNTRY"
    ])
  {
    const params = {
      urls: urls,
      values: values
    }
    return this.fetchAPI("start_report", params)
  }
  
  getReportData(report_id) {
    return this.fetchAPI("get_data", {report_id: report_id})
  }
  
  listReports() {
    return this.fetchAPI("list_reports")
  }
  
  listValueNames() {
    return this.fetchAPI("list_value_names")
  }
}
