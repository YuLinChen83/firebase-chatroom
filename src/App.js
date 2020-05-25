import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import SignUpAndSignIn from "./pages/SignUpAndSignIn";
import Login from "./pages/Login";
import { auth } from "./services/firebase";
import './styles.scss';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
      }
    />
  );
}

const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
            <Redirect to="/chat" />
          )
      }
    />
  );
}

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let unsubscribeFromAuth;
    unsubscribeFromAuth = auth.onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    });
    return () => {
      unsubscribeFromAuth = null;
    }
  }, []);

  return loading === true ? (
    <div className="spinner-border text-success" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute
            path="/chat"
            authenticated={authenticated}
            component={Chat}
          />
          <PublicRoute
            path="/signup"
            authenticated={authenticated}
            component={SignUpAndSignIn}
          />
          <PublicRoute
            path="/login"
            authenticated={authenticated}
            component={Login}
          />
        </Switch>
      </Router>
    );
}

export default App;