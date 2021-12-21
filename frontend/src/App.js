import Home from './components/Home';
import Login from "./components/LoginPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (<Router>
                        <Routes>
                            <Route path='/'  element={<Login/>} />
                            <Route path="/sign-in"  element= {<Login/>} />
                        </Routes>
           </Router>
    );
}

export default App;
