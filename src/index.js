import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./providers/UserProvider";
import PostsProvider from "./providers/PostsProvider";
import Application from "./components/Application";
import "./index.css";

render(
  <BrowserRouter>
    <UserProvider>
      <PostsProvider>
        <Application />
      </PostsProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
