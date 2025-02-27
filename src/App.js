import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import JsonViewer from './components/viewer';
import './styles/contract-viewing.css';

function App() {
  const [fileContent, setFileContent] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  React.useEffect(() => {
    document.title = 'Contract Viewer';
    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
    return () => {
      document.getElementById('fileUpload').removeEventListener('change', handleFileUpload);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Upload a file to see the preview
        </p>
        <input type="file" id="fileUpload" style={{ display: 'none' }} />
        <label htmlFor="fileUpload" className="App-upload-button">
          Upload File
        </label>
        <div className="json-viewer-container">
          <JsonViewer data={fileContent} />
        </div>
      </header>
    </div>
  );
}

export default App;
