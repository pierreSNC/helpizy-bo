import Post from "./components/Post/Post";
import Navbar from "./components/Navbar/Navbar";
import {Routes, Route} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Category from "./components/Category/Category";
import User from "./components/User/User";
import Author from "./components/Author/Author";
import Faq from "./components/FAQ/FAQ";

function App() {

  return (
    <div>
        <Navbar />
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/posts" element={<Post />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/users" element={<User />} />
            <Route path="/authors" element={<Author />} />
            <Route path="/faq" element={<Faq />} />
        </Routes>
    </div>
  )
}

export default App
