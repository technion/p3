import * as React from "react";
import InputLabel from "@material-ui/core/es/InputLabel";
import Input from "@material-ui/core/es/Input";
import FormControl from "@material-ui/core/es/FormControl";
import Paper from "@material-ui/core/es/Paper";
import Button from "@material-ui/core/es/Button";

import { P3Popup, PopupData } from "./p3-popup";
import { validcheck } from "./validcheck";
import { CForm } from "./captcha";

interface Formstate {
  showcaptcha: boolean;
  submitdisabled: boolean;
  captchaKey: string;
}

interface Objectarray {
  [key: string]: string;
}

export class P3Form extends React.Component<{}, PopupData & Formstate> {
  constructor(props: {}) {
    super(props);
    this.submitPassword = this.submitPassword.bind(this);
    this.showCaptcha = this.showCaptcha.bind(this);
    this.showSubmit = this.showSubmit.bind(this);
    this.state = {
      statuscode: "unset",
      message: "Undefined",
      showcaptcha: false,
      submitdisabled: true,
      captchaKey: ""
    };
  }

  public showCaptcha() {
    this.setState({
      showcaptcha: true
    });
  }

  public showSubmit(key: string) {
    this.setState({
      submitdisabled: false,
      captchaKey: key
    });
  }

  public submitPassword(e: any) {
    e.preventDefault();
    const formdata: Objectarray = {};
    const formkeys: string[] = ["username", "oldpassword", "newpassword"];
    for (const ele of formkeys) {
      formdata[ele] = e.target[ele].value.trim();
    }
    formdata.captcha = this.state.captchaKey;
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
      .then((response) => {
        return Promise.all([response.text(), response.ok]);
      })
      .then(([body, ok]) => {
        if (!ok) {
          throw new Error(body);
        }
        this.setState({ statuscode: "success", message: body });
      })
      .catch((err) => {
        this.setState({ statuscode: "servererror", message: err.message });
        console.error(err.message);
      });
  }

  public render() {
    const pstyles = {
      paddingTop: "16px",
      paddingBottom: "16px",
      paddingLeft: "32px",
      paddingRight: "32px",
      width: "50%",
      margin: "auto"
    };
    const buttonstyles = {
      marginTop: "24px",
      marginBottom: "16px"
    };

    const popup = (
      <P3Popup
        statuscode={this.state.statuscode}
        message={this.state.message}
      />
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
            <Input
              id="newpassword"
              type="password"
              onFocus={this.showCaptcha}
            />
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
            disabled={this.state.submitdisabled}
          >
            Change Password
          </Button>
          {this.state.showcaptcha && <CForm onVerify={this.showSubmit} />}
        </form>
      </Paper>
    );
  }
}
