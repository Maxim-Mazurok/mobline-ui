import React, { Component } from 'react';
import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  StyledComponentProps,
  TextField,
  Theme,
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

const styles = (theme: Theme) =>
  createStyles({
    buttonWrapper: {
      position: 'relative',
      margin: theme.spacing(1, 0),
    },
    errorMessage: {
      color: red[900],
    },
    buttonProgress: {
      position: 'absolute',
      top: loadingIconSize / 4,
      left: loadingIconSize / 4,
    },
  });

class AddCompetitor extends Component<AddCompetitorProps, AddCompetitorState> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.addCompetitorSetUsername(event.target.value);
  };

  render(): React.ReactElement<AddCompetitorProps, React.JSXElementConstructor<AddCompetitorState>> {
    const { classes } = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={this.props.showModal}
        disableBackdropClick={false}
        onClose={() => this.props.addCompetitorShowModal(false)}
        onBackdropClick={() => this.props.addCompetitorShowModal(false)}
      >
        <DialogTitle>Add competitor</DialogTitle>
        <DialogContent>
          <Typography component="p" style={{ maxWidth: 365 }}>
            Enter instagram handle of your competitor.<br />
          </Typography>
          <Typography component="p" style={{ maxWidth: 365 }}>
            For example, to add <Link href="https://instagram.com/maxim_mazurok">maxim_mazurok</Link>, enter
            "maxim_mazurok", without the at ("@") sign.
          </Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.props.addCompetitor();
            }}
          >
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
            <div
              className={classes.buttonWrapper}
            >
              <Button
                fullWidth
                type={"submit"}
                variant="contained"
                color="primary"
                disabled={this.props.username === '' || this.props.loading}
              >
                Add
              </Button>
              {this.props.loading && <CircularProgress size={loadingIconSize} className={classes.buttonProgress} />}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(AddCompetitor));
