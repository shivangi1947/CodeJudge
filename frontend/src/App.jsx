import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import ProblemsList from './components/problems/ProblemList';
import ProblemCard from './components/problems/ProblemCard';
import ProblemDetail from './components/problems/ProblemDetail';
import UserSubmissions from './components/submissions/UserSub';
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Logout from "./components/buttons/LogoutButton"
import { ThemeProvider } from './contexts/ThemeContext'
import AdminPage from './AdminPage';
import ProfilePage from './Profile';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './components/auth/adminProtectedRoute';
import CreateProblemPage from './admin/CreateProblemPage';
import EditProblemPage from './admin/EditProblemPage';
const App = () => {
  return (
    
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              
              <Route path="/profile" element={<ProfilePage />} />
              {/* <Route path="/admin" element={<AdminPage />} /> */}
              <Route path="/problems" element={<ProblemsList />} />
              <Route path="/problems/:id" element={<ProblemCard />} />
              <Route path="/probdetail/:id" element={<ProblemDetail />} />
              <Route path="/submissions/:problemId/:userId" element={<UserSubmissions />} />
            </Route>
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/problems/new" element={
                <AdminProtectedRoute>
                  <CreateProblemPage />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/problems/edit/:id" element={
                <AdminProtectedRoute>
                  <EditProblemPage />
                </AdminProtectedRoute>
              } />
            {/* </Routes> */}
            <Route path="/logout" element={<Logout />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;

//  Fetch actual problem by problemId from backend

//  Add a Run button and show output in bottom box

//  Add language dropdown (C++, Python, etc.)

//  Add expected output and verdict checking

//  Make the editor fancier using Monaco Editor