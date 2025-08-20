const { match } = require("node:assert")
const fs = require("node:fs")
const path = require("node:path")
const readline = require("node:readline")

run()

function escapeHtmlSpecialCharacters(text){
    return text.replace(/[<>&]/g,(match) => {
        switch (match){
            case "<":
                return"&lt;"
            case ">":
                return"&gt;"
            case "&":
                return "&amp;"
            default:
                return match
        }
    })
}

console.log(escapeHtmlSpecialCharacters("Isso é um código html. nele ´tem tags como <div>"))

function escapeHtmlFile(inputFilePath, outputFilePath){
    try {
        const fileContent = fs.readFileSync(inputFilePath, "utf-8")
        const escapedContent = escapeHtmlSpecialCharacters(fileContent)
        fs.writeFileSync(outputFilePath, escapedContent, "utf-8")
        console.log(`Arquivo escapado com sucesso: ${outputFilePath}`)
    }catch(error){
        console.log("Erro:", error.message)
        process.exit(1)
    }
}

function askFilePath(question){
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})

    return new Promise((resolve)=> {
        rl.question(question, (answer)=> {
            resolve(answer)
            rl.close()
        })
    })
}

async function  userInteraction() {
    //node html=escaper.js <inputPath> <outputPath>
    let inputPath = process.argv[2]
    if(!inputPath){
        inputPath = await askFilePath("Informe o caminho do arquivo de entrada: ")        
    }
    inputPath = path.resolve(inputPath)

    const defaultName = `escaped_${path.basename(inputPath)}.txt`
    const answer = await askFilePath(`Informe o caminho do arquivo de saída (padrão: ${defaultName}):`)
    let outputPath = answer.length > 0 ? answer : defaultName
    outputPath = path.resolve(outputPath)

    escapeHtmlFile(inputPath, outputPath)
}

function run(){
    if (process.arch.length >= 4){
        escapeHtmlFile(
            path.resolve(process.argv[2]), 
            path.resolve(process.argv[3])
    )
    } else{
        console.log("---------------")
        console.log("HTML Tag Escaper")
        console.log("---------------")
        console.log("Infome o caminho para realizar o escape.")
        userInteraction()
    }
}