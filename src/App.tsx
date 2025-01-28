import Post from "./components/Post/Post";
import Navbar from "./components/Navbar/Navbar";
import {Routes, Route} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Category from "./components/Category/Category";
import User from "./components/User/User";
import Author from "./components/Author/Author";
import Questions from "./components/FAQ/Questions";

import './App.css';
import { LanguageProvider } from './context/LanguageContext';
import AddCategory from "./components/Category/AddCategory";
import CategoryEdit from "./components/Category/CategoryEdit";
import EditUser from "./components/User/EditUser";
import EditQestion from "./components/FAQ/EditQestion";
import AddQuestion from "./components/FAQ/AddQuestion";
import EditPost from "./components/Post/EditPost";
import AddPost from "./components/Post/AddPost";

function App() {

  return (
    <main>
        <LanguageProvider>
            <Navbar />
            <section>
                <Routes>
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/posts" element={<Post />} />
                    <Route path="/post/edit/:id" element={<EditPost />} />
                    <Route path="/post/add-post" element={<AddPost />} />

                    <Route path="/categories" element={<Category />} />
                    <Route path="/category/add-category" element={<AddCategory />} />
                    <Route path="/category/edit/:id" element={<CategoryEdit />} />

                    <Route path="/users" element={<User />} />
                    <Route path="/user/edit/:id" element={<EditUser />} />

                    <Route path="/authors" element={<Author />} />

                    <Route path="/questions" element={<Questions />} />
                    <Route path="/question/edit/:id" element={<EditQestion />} />
                    <Route path="/question/add-question" element={<AddQuestion />} />
                </Routes>
            </section>
        </LanguageProvider>

    </main>
  )
}

export default App
