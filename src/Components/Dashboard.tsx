import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { createStyles, StyledComponentProps, withStyles, } from "@material-ui/core";

const styles = () =>
  createStyles({});

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {},
    dispatch
  );

export type DashboardProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {},
};

type DashboardState = {}

class Dashboard extends Component<DashboardProps, DashboardState> {
  componentDidUpdate(prevProps: DashboardProps) {

  }

  componentDidMount(): void {

  }

  render(): React.ReactElement<DashboardProps, React.JSXElementConstructor<DashboardState>> {
    return (
      <p>Section will be here soon...</p>
    );
  }
}

export const DashboardConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Dashboard));
