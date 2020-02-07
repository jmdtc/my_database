// client-side js
// run by the browser each time your view template is loaded

document.getElementById("yolo").addEventListener("click", () => {
  fetch("https://lrt-for-leap.glitch.me/test")
  .then(res => res.text())
  .then(d => console.log(d))
})

document.getElementById("dbButt").addEventListener("click", () => {
  fetch("https://lrt-for-leap.glitch.me/DB")
  .then(res => res.text())
  .then(d => console.log(d))
})