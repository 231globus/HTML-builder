const fs = require("fs")
const path = require("path")
const { readdir } = require("fs/promises")

const stylePath = path.join(__dirname, "styles")
const distPath = path.join(__dirname, "project-dist", "bundle.css")

async function createBundle() {
  const files = await readdir(stylePath, { withFileTypes: true })
  let rs
  let content = ""
  for(let file of files) {
    if(path.extname(file.name) === ".css" || file.isDirectory()) {
      const styleFile = path.join(stylePath, file.name)
      rs = fs.createReadStream(styleFile, "utf-8")
      rs.on("data", (chunk)=>{
        content = content + chunk
      })
    }
  }

  const ws = fs.createWriteStream(distPath)
  rs.on("end", ()=>{
    ws.write(content)
    console.log("bundle.css successfully created")
  })
}

createBundle()