const express=require("express");
const app=express();
const {generateFilePath} = require("./generateFilePath");
const {generateInputFile} = require("./generateInputFile");
const {executecpp} = require("./executecpp");
const cors = require("cors");

const PORT=process.env.PORT;

app.use(cors());
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // supports form-data (x-www-form-urlencoded)


app.post("/run", async (req, res) => 
{
    // Extract language, code, and input from request body with defaults
    const { language , code, input = '' } = req.body;
    
    // Validate that code is provided
    if (code === undefined || code.trim() === '') 
    {
        return res.status(400).json(
        { 
            success: false, 
            error: "Empty code! Please provide some code to execute." 
        });
    }
    
    try 
    {
        // Generate a temporary file with the user's code
        const filePath = await generateFilePath(language, code);
        
        // Generate a temporary file with the user's input (if any)
        const inputPath = await generateInputFile(input);
        
        // Compile and execute the C++ code
        const output = await executecpp(filePath, inputPath);
        
        // Send successful response with output
        res.json(
        { 
            success: true,
            filePath, 
            inputPath, 
            output 
        });

    } 
    
    catch (error) 
    {
       
        
        // Send error response with proper error message
        res.status(500).json(
        { 
            success: false,
            error: error.message || error.toString() || 'An error occurred while executing the code'
        });
    }
});


app.listen(PORT,()=>
{
    console.log(`Server is running on ${PORT}`);
    //console.log(__dirname);
});