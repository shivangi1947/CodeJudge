import { useRef, useEffect,useState} from 'react'
import './App.css'
import {uploadFile} from "./services/api"

function App() {

   const fileInputRef=useRef(null);
   const [file,setFile]=useState('');
   

    const onUpload=()=>
    {
      //console.log("button clicked");
      fileInputRef.current.click();
    };

    useEffect(()=>
    {
      const getImage=async()=>
      {
        if(file)
        {
          const data=new FormData();
          data.append("name",file.name);
          data.append("file",file);

          const response=await uploadFile(data);
          console.log(response);
        }

      };

      getImage();

    },[file]);
  

  return (
   

    <>
        
        <div className="main-wrapper"
         style={{
    backgroundImage: "url('/bg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  }}>
          <div className="container">
            <div className="wrapper">
              <h1>Shivangi File Sharing System</h1>
              <p>Upload your file and share with your friends !</p>

              <button onClick={onUpload}>Upload</button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }}
               onChange={(e) => 
                {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  console.log("File selected:", selectedFile); 
                }} />
            </div>
          </div>
        </div>
        
        
     
     
    </>
  )
}

export default App
