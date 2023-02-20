import { Button, Box } from "@mui/material";
import axios from "axios";
import React from "react";
function App() {
  const [files, setFiles] = React.useState("");

  async function fileUpload(e) {
    e.preventDefault();
    console.log(files);
    var formdata = new FormData();
    for (const key of Object.keys(files))
    {
      formdata.append('files', files[key]);
    }
    axios.post('http://localhost:3002/files/upload', formdata, {}).then(res => console.log(res.data));
  }
  return (
    <div className="App">
      <Box>
        <form onSubmit={(e) => fileUpload(e)}>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}

          />
          <Button variant="contained" type="submit">
            File Upload
          </Button>
        </form>
      </Box>
    </div>
  );
}

export default App;
