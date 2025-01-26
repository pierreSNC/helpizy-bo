import Post from "./components/Post/Post";
import Navbar from "./components/Navbar/Navbar";
import {Routes, Route} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Category from "./components/Category/Category";
import User from "./components/User/User";
import Author from "./components/Author/Author";
import Faq from "./components/FAQ/FAQ";

import './App.css';
import PostDetail from "./components/Post/PostDetail";
import { LanguageProvider } from './context/LanguageContext';
import AddCategory from "./components/Category/AddCategory";
import CategoryEdit from "./components/Category/CategoryEdit";

function App() {

  return (
    <main>
        <LanguageProvider>
            <Navbar />
            <section>
                <Routes>
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/posts" element={<Post />} />
                    <Route path="/post/:id" element={<PostDetail />} />

                    <Route path="/categories" element={<Category />} />
                    <Route path="/category/add-category" element={<AddCategory />} />
                    <Route path="/category/edit/:id" element={<CategoryEdit />} />

                    <Route path="/users" element={<User />} />
                    <Route path="/authors" element={<Author />} />
                    <Route path="/faq" element={<Faq />} />
                </Routes>
            </section>
        </LanguageProvider>

    </main>
  )
}

export default App
