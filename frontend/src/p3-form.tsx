import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { withStyles, createStyles, WithStyles, Theme } from "@material-ui/core/styles";

export const P3HW = () => (<div>Hello World</div>);

const styles = (theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    width: "50%",
    margin: "auto",
  },
});

export const P3Form = withStyles(styles)(
class extends React.Component<WithStyles<typeof styles>> {
  public render() {
    const { classes } = this.props;
    return (
    <Paper className={classes.root}>
     <TextField
          id="username"
          label="User Name"
          margin="normal"
        /> <br />
       <TextField
          id="oldpassword"
          label="Old Password"
          margin="normal"
        /> <br />
       <TextField
          id="newpassword"
          label="New Password"
          margin="normal"
        /> <br />
      </Paper>
    );
  }
});
