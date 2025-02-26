import logo from './logo.svg';
import './App.css';

function App() {
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
      </header>
    </div>
  );
}

export default App;
