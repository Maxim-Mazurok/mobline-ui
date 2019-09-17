import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import {
  createStyles,
  IconButton,
  StyledComponentProps,
  Theme,
  Toolbar,
  Typography,
  withStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from '@material-ui/icons/Search';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { openDrawer } from '../actions';
import GlobalState from '../types/GlobalState';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    // search: {
    //   position: 'relative',
    //   borderRadius: theme.shape.borderRadius,
    //   backgroundColor: fade(theme.palette.common.white, 0.15),
    //   '&:hover': {
    //     backgroundColor: fade(theme.palette.common.white, 0.25),
    //   },
    //   marginLeft: 0,
    //   width: '100%',
    //   [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(1),
    //     width: 'auto',
    //   },
    // },
    // searchIcon: {
    //   width: theme.spacing(7),
    //   height: '100%',
    //   position: 'absolute',
    //   pointerEvents: 'none',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    // inputRoot: {
    //   color: 'inherit',
    // },
    // inputInput: {
    //   padding: theme.spacing(1, 1, 1, 7),
    //   transition: theme.transitions.create('width'),
    //   width: '100%',
    //   [theme.breakpoints.up('sm')]: {
    //     width: 120,
    //     '&:focus': {
    //       width: 200,
    //     },
    //   },
    // },
  });

const mapStateToProps = ({ user }: GlobalState) => ({
  userProfile: user.userProfile,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      openDrawer,
    },
    dispatch,
  );

export type TopBarProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  title?: string,
  classes: {
    root: string,
    menuButton: string,
    title: string,
    // search: string,
    // searchIcon: string,
    // inputRoot: string,
    // inputInput: string,
  },
};

type TopBarState = {}

class TopBar extends Component<TopBarProps, TopBarState> {
  render(): React.ReactElement<TopBarProps, React.JSXElementConstructor<TopBarState>> {
    const { classes } = this.props;

    return (
      <div
        className={classes.root}
      >
        <AppBar
          className={classes.appBar}
          position="static"
        >
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={this.props.openDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              {this.props.title}
            </Typography>
            {/*<div className={classes.search}>*/}
            {/*  <div className={classes.searchIcon}>*/}
            {/*    <SearchIcon />*/}
            {/*  </div>*/}
            {/*  <InputBase*/}
            {/*    placeholder="Search…"*/}
            {/*    classes={{*/}
            {/*      root: classes.inputRoot,*/}
            {/*      input: classes.inputInput,*/}
            {/*    }}*/}
            {/*    inputProps={{ 'aria-label': 'Search' }}*/}
            {/*  />*/}
            {/*</div>*/}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export const TopBarConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(TopBar));
