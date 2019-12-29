import React, { Component } from "react";
import { firestore } from "../firebase";
import Post from "./Post";
import Comments from "./Comments";
import withUser from "./withUser";

class PostPage extends Component {
  state = { post: null, comments: [] };

  get postId() {
    return this.props.match.params.id;
  }

  get postRef() {
    return firestore.doc(`posts/${this.postId}`);
  }

  get commentsRef() {
    return this.postRef.collection("comments");
  }

  unsubscribeFromPost = null;
  unsubscribeFromComments = null;

  componentDidMount = async () => {
    this.unsubscribeFromPost = this.postRef.onSnapshot(snapshot => {
      const post = { id: this.postId, ...snapshot.data() };
      this.setState({ post });
    });
    this.unsubscribeFromComments = this.commentsRef.onSnapshot(snapshot => {
      const comments = snapshot.docs.map(snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      }));
      this.setState({ comments });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromPost();
    this.unsubscribeFromComments();
  };

  createComment = comment => {
    this.commentsRef.add({ ...comment, user: this.props.user });
  };

  render() {
    const { post, comments } = this.state;
    return (
      <section>
        {post && <Post {...post} />}
        <Comments comments={comments} onCreate={this.createComment} />
      </section>
    );
  }
}

export default withUser(PostPage);
