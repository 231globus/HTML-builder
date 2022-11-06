const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname, "text.txt")

const rs = fs.createReadStream(filePath)

rs.on("data", function(chunk) {
  console.log(chunk.toString())
})
