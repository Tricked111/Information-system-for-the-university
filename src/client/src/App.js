import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes,Route,} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import './App.scss';
import Container from 'react-bootstrap/Container';
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import { LoggedUserContext, loggedUser as loggedUserDefault } from "./Context/LoggedUser";
import 'react-toastify/dist/ReactToastify.css';
import SignUp from "./Pages/SignUp/SignUp";
import MyProfile from "./Pages/MyProfile/MyProfile";
import createRequest from "./Services/CreateRequest";
import Admin from "./Pages/Admin/Admin";
import UserList from "./Pages/UserList/UserList";
import Courses from "./Pages/Courses/Courses";
import CourseTermins from "./Pages/CourseTermins/CourseTermins";
import UsersOfTermin from "./Pages/UsersOfTermin/UsersOfTemin";
import CourseDetails from "./Pages/CourseDetails/CourseDetails";
import Rooms from "./Pages/Rooms/Rooms";

export default function App() {
  const [loggedUser, setLoggedUser] = useState(loggedUserDefault)

  useEffect(() => {
      createRequest({
          path: '/get-logged-user',
          method: 'GET'
      })
      .then(res => res.json())
      .then(res => {
          setLoggedUser({...res, token: localStorage.getItem('token')});
      })
      .catch(err => {
          console.error(err)
      })
  },
  [])
  return (
    <>
    <LoggedUserContext.Provider value={{loggedUser: {...loggedUser}, setLoggedUser: setLoggedUser}}>
      <Router>
        <Navbar/>
        <Container className="app-body-container">
          <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/sign-up" element={<SignUp />}/>
            <Route path="/my-profile" element={<MyProfile />}/>
            <Route path="/courses" element={<Courses />}/>
            <Route path="/course/:id" element={<CourseDetails />}/>

            <Route path="/rooms" element={<Rooms />}/>

            {/* {loggedUser.role === 'a' && */}
            <>
              <Route path="/admin" element={<Admin />}/>
              <Route path="/user-list" element={<UserList />}/>
              <Route path="/termins/:id" element={<CourseTermins />}/>
              <Route path="/termins-users/:id" element={<UsersOfTermin />}/>
            </>
          </Routes>
        </Container>
        <Footer/>
      </Router>
    </LoggedUserContext.Provider>
    </>
  );
}