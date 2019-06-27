import React, { Component } from 'react';
import {
  Button,
  IconButton,
  InputAdornment,
  Link,
  Modal,
  StyledComponentProps,
  TextField,
  Typography
} from "@material-ui/core";
import { setInviteCode } from "../actions";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { inviteCodeIsCorrect } from "../selectors";
import GlobalState from "../types/GlobalState";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { MyPaper } from "./AddCompetitor";
import { showSnackbarAction, SnackbarType } from "../actions/snackbar";

const mapStateToProps = ({ user }: GlobalState) => ({
  inviteCode: user.inviteCode,
  inviteCodeIsCorrect: inviteCodeIsCorrect(user),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setInviteCode,
      showSnackbarAction,
    },
    dispatch
  );

export type InviteCodeProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {};

type InviteCodeState = {
  showInviteCode: boolean,
  triedToSubmit: boolean,
};

class InviteCode extends Component<InviteCodeProps, InviteCodeState> {
  state: InviteCodeState = {
    showInviteCode: false,
    triedToSubmit: false,
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setInviteCode(event.target.value);
  };

  render() {
    return (
      <Modal open={!this.props.inviteCodeIsCorrect}>
        <MyPaper>
          <Typography variant="h5" component="h3">
            Enter your invite code.
          </Typography>
          <Typography component="p" style={{ maxWidth: 365 }}>
            Mobline is currently in beta, so we only let the very limited number of users access our service.<br />
          </Typography>
          <Typography component="p" style={{ maxWidth: 365 }}>
            You may <Link
            target="_blank"
            rel="noopener"
            href="mailto:maxim@mazurok.com?subject=Mobline invite code request">request invite code</Link> if you want
            to participate in our beta program.
          </Typography>
          <TextField
            error={this.state.triedToSubmit && !this.props.inviteCodeIsCorrect}
            fullWidth
            id="invite-code-input"
            label="Invite Code"
            value={this.props.inviteCode}
            onChange={this.handleChange}
            margin="normal"
            type={this.state.showInviteCode ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="Toggle password visibility"
                    onClick={() => this.setState({ showInviteCode: !this.state.showInviteCode })}
                  >
                    {this.state.showInviteCode ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={this.props.inviteCode === ''}
            onClick={() => {
              this.setState({ triedToSubmit: true });
              if (!this.props.inviteCodeIsCorrect) {
                this.props.showSnackbarAction({
                  title: "Invite code is incorrect, sorry.",
                  type: SnackbarType.ERROR,
                });
              }
            }}
          >
            Let me in!
          </Button>
        </MyPaper>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InviteCode);
