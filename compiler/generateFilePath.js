const fs=require("fs");
const path=require("path");
const {v4:uuid}=require("uuid");

const dirCode=path.join(__dirname,"codes");

if(!fs.existsSync(dirCode))
{
    fs.mkdirSync(dirCode,{recursive:true});
    // This tells Node.js:"If the parent folders in the path don't exist, create them too."
    // It avoids errors when trying to create nested folders.
    
}

exports.generateFilePath= async(language,code) =>
{
    const codeId=uuid();
    const fileName=`${codeId}.${language}`;
    const filePath=path.join(dirCode,fileName);
    fs.writeFileSync(filePath,code);

    return filePath;
};