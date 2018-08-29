import * as React from "react";
import * as ReactDOM from "react-dom"; // Aliased to react-dom-lite

import { P3Form } from "./p3-form";

require("./critical.css");

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <React.Fragment>
        <P3Form />
        <div id="g-recaptcha" />
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
