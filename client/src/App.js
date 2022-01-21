import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import {
  BrowserRouter as Browser,
  Route,
  Routes,
  useNavigate,
  useLocation
} from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPosts from "./components/screens/SubscribedUser";
import Reset from "./components/screens/Reset";
import NewPassword from "./components/screens/Newapassword";
export const UserContext = createContext();

const Routing = () => {
  const history = useNavigate();
  const location = useLocation()

  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!location.pathname.startsWith("/reset")) history("/signin");
    }
  }, []);

  

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/signin" element={<Signin />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/create" element={<CreatePost />} />
      <Route exact path="/myfollowingpost" element={<SubscribedUserPosts />} />
      <Route exact path="/profile/:userid" element={<UserProfile />} />
      <Route exact path="/reset" element={<Reset />} />
      <Route exact path="/reset/:token" element={<NewPassword />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Browser>
          <NavBar />
          <Routing />
        </Browser>
      </UserContext.Provider>
    </>
  );
}

export default App;
