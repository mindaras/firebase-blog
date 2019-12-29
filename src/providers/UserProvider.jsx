import React, { Component, createContext } from "react";
import { auth, createUserProfileDocument } from "../firebase";

export const UserContext = createContext(null);

class UserProvider extends Component {
  state = { user: null };

  unsubscribeFromAuth = null;

  componentDidMount = () => {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      const userRef = await createUserProfileDocument(userAuth);
      userRef.onSnapshot(snapshot => {
        this.setState({ user: snapshot.data() });
      });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromAuth();
  };

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
