import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Settings from "./pages/settings/Settings"
import PhotoAlbum from "./pages/photoAlbum/PhotoAlbum"
import About from "./pages/about/About"
import {
  BrowserRouter as Router,
  Switch,
  Route, 
  Redirect
} from "react-router-dom";
import {useContext} from 'react'
import {AuthContext} from './context/AuthContext'


function App() {

  const {user} = useContext(AuthContext)

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Login />}
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/"/> : <Login />}
        </Route>
        <Route path="/register">
        {user ? <Redirect to="/"/> : <Register />}
        </Route>
        <Route path="/profile/:username">
          {user ? <Profile/> : <Redirect to="/"/>}
        </Route>
        <Route path="/settings/:username">
          {user ? <Settings/> : <Redirect to="/"/>}
        </Route>
        <Route path="/photoAlbum/:username">
          {<PhotoAlbum/>}
        </Route>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </Router>
  );  
}

export default App;
