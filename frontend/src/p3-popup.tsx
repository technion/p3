import * as React from "react";
import Button from "@material-ui/core/es/Button";
import Dialog from "@material-ui/core/es/Dialog";
import DialogActions from "@material-ui/core/es/DialogActions";
import DialogContent from "@material-ui/core/es/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText";
import DialogTitle from "@material-ui/core/es/DialogTitle";

export interface PopupData {
  statuscode: "success" | "servererror" | "invalid" | "unset";
  message: string;
}

export class P3Popup extends React.Component<PopupData> {
  constructor(props: PopupData) {
    super(props);
    this.reloadpage = this.reloadpage.bind(this);
  }

  public render() {
    const { statuscode, message } = this.props;
    let dialog: string;
    if (statuscode === "success") {
      dialog = "Password has been successfully reset";
    } else if (statuscode === "invalid") {
      dialog = `Invalid input provided: ${message}`;
    } else if (statuscode === "servererror") {
      dialog = `Password reset failed. Server returned error: ${message}`;
    } else {
      throw new Error("Invalid statuscode");
    }

    return (
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { (statuscode === "success") ?
            "Success" : "Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog}
          </DialogContentText>
        </DialogContent>
       <DialogActions>
            <Button onClick={ this.reloadpage } color="primary">
              Reload
            </Button>
      </DialogActions>
      </Dialog>
    );
  }

  private reloadpage() {
    location.reload();
  }

}
