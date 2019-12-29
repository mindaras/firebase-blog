import React, { Component } from "react";
import { firestore, auth, storage } from "../firebase";

class UserProfile extends Component {
  imageRef = null;

  state = { displayName: "" };

  get uid() {
    return auth.currentUser.uid;
  }

  get userRef() {
    return firestore.doc(`users/${this.uid}`);
  }

  get file() {
    return this.imageRef && this.imageRef.files[0];
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { displayName } = this.state;

    if (displayName) {
      this.userRef.update({ displayName });
      this.setState({ displayName: "" });
    }

    if (this.file) {
      storage
        .ref()
        .child("user-profiles")
        .child(this.uid)
        .child(this.file.name)
        .put(this.file)
        .then(response => response.ref.getDownloadURL())
        .then(photoURL => this.userRef.update({ photoURL }));
    }
  };

  render() {
    const { displayName } = this.state;
    return (
      <section className="UserProfile">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="displayName"
            value={displayName}
            onChange={this.handleChange}
            placeholder="Display name"
          />
          <input type="file" ref={ref => (this.imageRef = ref)} />
          <input className="update" type="submit" />
        </form>
      </section>
    );
  }
}

export default UserProfile;
