import * as React from "react";
import * as ReactDOM from "react-dom"; // Aliased to react-dom-lite
import CssBaseline from "@material-ui/core/es/CssBaseline";
import Typography from "@material-ui/core/es/Typography";

import { P3Form } from "./p3-form";

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Typography variant="display4" gutterBottom align="center">
          P3 AD Password Reset Utility
        </Typography>
        <P3Form />
        <div id="g-recaptcha"></div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
