const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outCode = path.join(__dirname, "outputs");

if (!fs.existsSync(outCode)) {
  fs.mkdirSync(outCode, { recursive: true });
}

// Now also accept inputPath
exports.executecpp = async (filePath, inputPath) => 
{
  const outId = path.basename(filePath.split(".")[0]);//basename nikalega
  const outPath = path.join(outCode, `${outId}.out`);//main dir ka path bana diya

  const runCommand =
    process.platform === "win32"
      ? `"${outPath}" < "${inputPath}"`
      : `cd ${outCode} && ./${outId}.out < "${inputPath}"`;
      // exec me convert karna padta hai

  return new Promise((resolve, reject) => 
{
    const compileCommand = `g++ "${filePath}" -o "${outPath}"`;

    exec(compileCommand, (compileErr, _, compileStderr) => 
    {
      if (compileErr) 
        
        {
            return reject(
            {
            error: "Compilation failed",
            stderr: compileStderr || compileErr.message,
            });
        }

      exec(runCommand, { timeout: 5000 }, (runErr, stdout, stderr) => {
        if (runErr) {
          return reject({
            error: "Execution failed",
            stderr: stderr || runErr.message,
          });
        }

        resolve(stdout);
      });
    });
  });
};
