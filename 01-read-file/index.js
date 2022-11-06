const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname, "text.txt")

const rs = fs.createReadStream(filePath, "utf-8")

let contentFile = ''

rs.on("data", chunk => contentFile += chunk)

rs.on("end", () => console.log(contentFile))

rs.on("error", err => {
  if(err) throw err
})