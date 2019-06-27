import React, { Component } from "react";
import { connect } from "react-redux";
import {
  createStyles,
  IconButton,
  Snackbar as MaterialSnackbar,
  SnackbarContent,
  StyledComponentProps,
  Theme,
  withStyles
} from "@material-ui/core";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import GlobalState from "../types/GlobalState";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { showSnackbarAction, SnackbarType } from "../actions/snackbar";
import { amber, green } from "@material-ui/core/colors";
import clsx from 'clsx';

const variantIcon = {
  [SnackbarType.SUCCESS]: CheckCircleIcon,
  [SnackbarType.WARNING]: WarningIcon,
  [SnackbarType.ERROR]: ErrorIcon,
  [SnackbarType.INFO]: InfoIcon,
  [SnackbarType.HIDDEN]: null,
};

const styles = (theme: Theme) =>
  createStyles({
    [SnackbarType.SUCCESS]: {
      backgroundColor: green[600],
    },
    [SnackbarType.WARNING]: {
      backgroundColor: amber[700],
    },
    [SnackbarType.ERROR]: {
      backgroundColor: theme.palette.error.dark,
    },
    [SnackbarType.INFO]: {
      backgroundColor: theme.palette.primary.dark,
    },
    [SnackbarType.HIDDEN]: {
      backgroundColor: theme.palette.primary.dark,
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  });

const mapStateToProps = ({ snackbar }: GlobalState) => ({
  snackbar,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      showSnackbarAction,
    },
    dispatch
  );

export type SnackbarProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    [SnackbarType.SUCCESS]: string,
    [SnackbarType.WARNING]: string,
    [SnackbarType.ERROR]: string,
    [SnackbarType.INFO]: string,
    [SnackbarType.HIDDEN]: string,
    icon: string,
    iconVariant: string,
    message: string,
  },
};

type SnackbarState = {}

class Snackbar extends Component<SnackbarProps, SnackbarState> {
  handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    this.props.showSnackbarAction({
      type: SnackbarType.HIDDEN,
      title: "",
    });
  };

  render(): React.ReactElement<SnackbarProps, React.JSXElementConstructor<SnackbarState>> | null {
    if (this.props.snackbar.type === SnackbarType.HIDDEN) {
      return null;
    }

    const { classes } = this.props;

    const Icon = variantIcon[this.props.snackbar.type];

    return (
      <MaterialSnackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={true}
        autoHideDuration={6000}
        onClose={this.handleClose}
      >
        <SnackbarContent
          className={classes[this.props.snackbar.type]}
          aria-describedby="client-snackbar"
          message={
            <span
              id="client-snackbar"
              className={classes.message}
            >
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {this.props.snackbar.title}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]} />
      </MaterialSnackbar>
    );
  }
}

export const SnackbarConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Snackbar));
