import React from "react";
import { UserContext } from "../providers/UserProvider";

const getDisplayName = Component => {
  return Component.displayName || Component.name || "Component";
};

const withUser = Component => {
  const WrappedComponent = props => (
    <UserContext.Consumer>
      {user => <Component user={user} {...props} />}
    </UserContext.Consumer>
  );
  WrappedComponent.displayName = `withUser(${getDisplayName(
    WrappedComponent
  )})`;
  return WrappedComponent;
};

export default withUser;
