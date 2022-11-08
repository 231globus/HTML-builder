const process = require("process")
const {stdin} = process
const path = require("path")
const fs = require("fs")

const filePath = path.join(__dirname, "file.txt")

const writeStream = fs.createWriteStream(filePath)

console.log("Write text:")

stdin.on("data", (data)=>{

  if(data.toString().trim()==="exit") {
    console.log("file.txt created successfully")
    process.exit()
  }

  writeStream.write(data)
  
})

process.on("SIGINT", ()=>{
  console.log("file.txt created successfully")
  process.exit();
})
