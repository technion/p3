import * as React from "react";
import InputLabel from "@material-ui/core/es/InputLabel";
import Input from "@material-ui/core/es/Input";
import FormControl from "@material-ui/core/es/FormControl";
import Paper from "@material-ui/core/es/Paper";
import Button from "@material-ui/core/es/Button";

import { P3Popup, PopupData } from "./p3-popup";
import { validcheck } from "./validcheck";

interface Formstate {
  httpcode: number;
  message: string;
}

interface Objectarray {
  [key: string]: string;
}

export class P3Form extends React.Component<{}, PopupData> {
  constructor(props: {}) {
    super(props);
    this.submitPassword = this.submitPassword.bind(this);
    this.state = {
      statuscode: "unset",
      message: "Undefined"
    };
  }

  public submitPassword(e: any) {
    e.preventDefault();
    const formdata: Objectarray = {};
    const formkeys: string[] = ["username", "oldpassword", "newpassword"];
    for (const ele of formkeys) {
      formdata[ele] = e.target[ele].value.trim();
    }
    try {
      validcheck(formdata, e.target.confirmpassword.value.trim());
    } catch (err) {
      this.setState({ statuscode: "invalid", message: err.message });
      return;
    }

    fetch("https://p3.lolware.net/api", {
      body: JSON.stringify(formdata),
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      method: "POST"
    })
      .then(response => {
        return Promise.all([response.text(), response.ok, response.status]);
      })
      .then(([body, ok, status]) => {
        if(!ok) {
          console.log(`Server returned status ${status}`);
          throw new Error(body);
        }
          this.setState({ statuscode: "success", message: body });
      })
      .catch(err => {
        this.setState({ statuscode: "servererror", message: err.message });
        console.error(err.message);
      });
  }

  public render() {
    const pstyles = {
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 32,
      paddingRight: 32,
      width: "50%",
      margin: "auto"
    };
    const buttonstyles = {
      marginTop: 32
    };

    const popup = (
      <P3Popup statuscode={this.state.statuscode} message={this.state.message} />
    );

    return (
      <Paper style={pstyles}>
        <form onSubmit={this.submitPassword}>
          {this.state.statuscode !== "unset" && popup}
          <FormControl>
            <InputLabel htmlFor="username">User Name</InputLabel>
            <Input id="username" type="email" />
          </FormControl>
          <br />
          <FormControl>
            <InputLabel htmlFor="oldpassword">Old Password</InputLabel>
            <Input id="oldpassword" type="password" />
          </FormControl>
          <br />
          <FormControl>
            <InputLabel htmlFor="newpassword">New Password</InputLabel>
            <Input id="newpassword" type="password" />
          </FormControl>
          <br />
          <FormControl>
            <InputLabel htmlFor="confirmpassword">Confirm Password</InputLabel>
            <Input id="confirmpassword" type="password" />
          </FormControl>
          <br />
          <Button
            variant="contained"
            color="secondary"
            style={buttonstyles}
            type="submit"
          >
            Change Password
          </Button>
        </form>
      </Paper>
    );
  }
}
