const fs = require("fs")
const path = require("path")
const { copyFile, readdir } = require("fs/promises")

const distPath = path.join(__dirname, "project-dist")
const templatePath = path.join(__dirname, "template.html")
const componentsPath = path.join(__dirname, "components")
const assetsDistPath = path.join(distPath, "assets")
const assetsPath = path.join(__dirname, "assets")
const indexPath = path.join(distPath, "index.html")

fs.mkdir(distPath, { recursive: true }, err=>{
  if(err) throw err
})

fs.mkdir(path.join(distPath, "assets"), { recursive: true }, err=>{
  if(err) throw err
})

async function createBundle() {
  const stylePath = path.join(__dirname, "styles")
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

  const ws = fs.createWriteStream(path.join(distPath, "style.css"))
  rs.on("end", ()=>{
    ws.write(content)
  })
}

createBundle()

async function copyAssets(assetsDistPath, assetsPath) {
  const files = await readdir(assetsPath, { withFileTypes: true })
  for(let file of files) {
    if(file.isDirectory()) {
      fs.mkdir(path.join(assetsDistPath, file.name), { recursive: true }, err=>{
        if(err) throw err
      })
      copyAssets(path.join(assetsDistPath, file.name), path.join(assetsPath, file.name))
      continue
    }
    copyFile(path.join(assetsPath, file.name), path.join(assetsDistPath, file.name))
  }
}

copyAssets(assetsDistPath, assetsPath)

async function buildHtml() {
  let content = ""
  let rsContent
  const files = await readdir(componentsPath, { withFileTypes: true })
  const rs = fs.createReadStream(templatePath, "utf-8")
  rs.on("data", (chunk)=>{
    content = chunk
  })
  rs.on("end", ()=>{
    content = content.split(/{{|}}/g)
    for(let file of files) {
      if(path.extname(file.name) === ".html" || !file.isDirectory()) {

        const fileName = file.name.slice(0, file.name.length - path.extname(file.name).length)
        const filePath = path.join(componentsPath, file.name)
        const i = content.indexOf(fileName)
        
        if(i!==-1) {
          content[i] = ""
          rsContent = fs.createReadStream(filePath, "utf-8")
          rsContent.on("data", chunk=>{
            content[i] = chunk
            
          })
        }
      }
    }
    rsContent.on("end", ()=>{
      content = content.join('')
      const ws = fs.createWriteStream(indexPath)
      ws.write(content)
    })
  })
}

buildHtml()