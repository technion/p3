import * as React from "react";
import InputLabel from "@material-ui/core/es/InputLabel";
import Input from "@material-ui/core/es/Input";
import FormControl from "@material-ui/core/es/FormControl";
import Paper from "@material-ui/core/es/Paper";

export const P3HW = () => <div>Hello World</div>;

export class P3Form extends React.Component {
  public render() {
    const pstyles = {
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 32,
      paddingRight: 32,
      width: "50%",
      margin: "auto"
    };
    return (
      <Paper style={pstyles}>
        <FormControl>
          <InputLabel htmlFor="username">User Name</InputLabel>
          <Input id="username" />
        </FormControl>
        <br />
        <FormControl>
          <InputLabel htmlFor="oldpassword">Old Password</InputLabel>
          <Input id="oldpassword" />
        </FormControl>
        <br />
        <FormControl>
          <InputLabel htmlFor="newpassword">New Password</InputLabel>
          <Input id="newpassword" />
        </FormControl>
      </Paper>
    );
  }
}
