const { readdir } = require("fs/promises")
const fs = require("fs")
const path = require("path")

const dirPath = path.join(__dirname, "secret-folder")

async function readSecretFolders() {
  const files = await readdir(dirPath, {withFileTypes: true})

  for(let file of files){
    if(!file.isDirectory()) {
      let extName = path.extname(file.name)
      let fileName = file.name

      const filePath = path.join(dirPath, fileName)

      fs.stat(filePath, (err, stats)=>{
        if(err) {
          throw(err)
        }
        console.log(
          fileName.slice(0, fileName.length-extName.length) + " - "
          + extName.slice(1) + " - " + stats.size + " bytes"
        )
      })
    }
  }
}

readSecretFolders()




