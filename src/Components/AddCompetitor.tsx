import React, { Component } from 'react';
import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  StyledComponentProps,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import GlobalState from "../types/GlobalState";
import { addCompetitor, addCompetitorSetUsername, addCompetitorShowModal } from "../actions/addCompetitor";
import { red } from "@material-ui/core/colors";

const mapStateToProps = ({ addCompetitor }: GlobalState) => ({
  error: addCompetitor.error,
  username: addCompetitor.username,
  loading: addCompetitor.loading,
  showModal: addCompetitor.showModal,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      addCompetitor,
      addCompetitorSetUsername,
      addCompetitorShowModal,
    },
    dispatch
  );

export type AddCompetitorProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    buttonWrapper: string,
    errorMessage: string,
    buttonProgress: string,
  }
};

type AddCompetitorState = {};

const loadingIconSize = 24;

const styles = () =>
  createStyles({
    buttonWrapper: {
      position: 'relative',
    },
    errorMessage: {
      color: red[900],
    },
    buttonProgress: {
      position: 'absolute',
      top: "50%",
      left: "50%",
      marginTop: -loadingIconSize / 2,
      marginLeft: -loadingIconSize / 2,
    },
  });

class AddCompetitor extends Component<AddCompetitorProps, AddCompetitorState> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.addCompetitorSetUsername(event.target.value);
  };

  closeDialog = () => {
    this.props.addCompetitorShowModal(false);
  };

  render(): React.ReactElement<AddCompetitorProps, React.JSXElementConstructor<AddCompetitorState>> {
    const { classes } = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={this.props.showModal}
        disableBackdropClick={false}
        onClose={this.closeDialog}
        onBackdropClick={this.closeDialog}
      >
        <DialogTitle>Add competitor</DialogTitle>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            this.props.addCompetitor();
          }}
        >
          <DialogContent>
            <Typography component="p">
              Enter instagram handle of your competitor.<br />
            </Typography>
            <Typography component="p">
              For example, to add <Link href="https://instagram.com/maxim_mazurok">maxim_mazurok</Link>, enter
              "maxim_mazurok", without the at ("@") sign.
            </Typography>

            <TextField
              disabled={this.props.loading}
              error={typeof this.props.error === "string" && this.props.error.length > 0}
              id="invite-code-input"
              label="Username"
              value={this.props.username}
              onChange={this.handleChange}
              margin="normal"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant={"text"}
              color={"primary"}
              disabled={this.props.loading}
              onClick={this.closeDialog}
            >
              Cancel
            </Button>
            <div
              className={classes.buttonWrapper}
            >
              <Button
                type={"submit"}
                variant={"contained"}
                color={"primary"}
                disabled={this.props.username === '' || this.props.loading}
              >
                Add
              </Button>
              {this.props.loading && <CircularProgress
                size={loadingIconSize}
                className={classes.buttonProgress}
                disableShrink
              />}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(AddCompetitor));
