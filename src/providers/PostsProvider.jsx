import React, { Component, createContext } from "react";
import { firestore } from "../firebase";

export const PostsContext = createContext({ posts: [] });

class PostsProvider extends Component {
  state = { posts: [] };

  unsubscribeFromFirestore = null;

  componentDidMount = () => {
    this.unsubscribeFromFirestore = firestore
      .collection("posts")
      .onSnapshot(snapshot => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.setState({ posts });
      });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromFirestore();
  };

  render() {
    return (
      <PostsContext.Provider value={this.state.posts}>
        {this.props.children}
      </PostsContext.Provider>
    );
  }
}

export default PostsProvider;
