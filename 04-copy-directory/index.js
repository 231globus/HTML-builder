const fs = require("fs")
const path = require("path")
const{ copyFile, readdir } = require("fs/promises")

const pathDir = path.join(__dirname, "files")
const copyDir = path.join(__dirname, "files-copy")

fs.mkdir(copyDir, { recursive: true }, err=>{
  if(err) throw err
})

async function copyFiles() {
  const copyFiles = await readdir(copyDir)

  for(let file of copyFiles) {
    let copyPath = path.join(copyDir, file)
    fs.unlink(copyPath, err=>{
      if(err) throw err
    })
    
  }

  const files = await readdir(pathDir)

  for(let file of files) {
    let filePath = path.join(pathDir, file)
    let copyPath = path.join(copyDir, file)
    await copyFile(filePath, copyPath)
  }

  console.log("Files copied successfully!")
}

copyFiles()

