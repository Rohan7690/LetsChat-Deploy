import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './Pages/Home'
import Chatpage from './Pages/Chatpage'
import './App.css'

function App() {
  return (
    <div className="App">
    <Routes>
        <Route path="/" element={<Home/>} exact/>
        <Route path="/chat" element={<Chatpage/>} />
    </Routes>
    </div>
  );
}

export default App;
