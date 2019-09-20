import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { closeDrawer, openDrawer } from '../actions';
import {
  createStyles,
  Drawer,
  Hidden,
  List,
  ListItemIcon,
  StyledComponentProps,
  SwipeableDrawer,
  withStyles,
} from '@material-ui/core';
import GlobalState from '../types/GlobalState';
import { drawerIsOpen } from '../selectors';
import { menuStructure, MenuStructureItemType } from '../reducers/menu';
import { RouteComponentProps, withRouter } from 'react-router';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { connect } from 'react-redux';
import './MainDrawer.scss';

const mapStateToProps = ({ menu }: GlobalState) => ({
  drawerIsOpen: drawerIsOpen(menu),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      openDrawer,
      closeDrawer,
    },
    dispatch,
  );

export type MainDrawerProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    drawer: string
    drawerPaper: string
  }
}
  & {
  title?: string,
};

type MainDrawerState = {}

const drawerWidth = 240;

const styles = () =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: 'rgb(251, 251, 251)',
      border: 'none',
    },
  });

const CollisionLink = React.forwardRef((props: NavLinkProps, ref: React.Ref<HTMLAnchorElement>) => (
  <NavLink innerRef={ref} {...props} />
));

const drawer = (onClick: () => void) => (
  <div
    role="presentation"
    style={{
      height: '100%',
    }}
  >
    <List
      disablePadding
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 24,
        paddingBottom: 32,
      }}
    >
      {
        menuStructure.map((menuStructureItem, index) => {
          switch (menuStructureItem.type) {
            case MenuStructureItemType.ITEM:
              return (
                <ListItem
                  key={index}
                  button
                  component={CollisionLink}
                  activeClassName={'Alex-selected'}
                  to={menuStructureItem.item.path}
                  exact
                  onClick={onClick}
                >
                  {
                    menuStructureItem.item.icon &&
                    <ListItemIcon style={{
                      minWidth: 32,
                    }}>
                      <menuStructureItem.item.icon />
                    </ListItemIcon>
                  }
                  <ListItemText
                    primary={menuStructureItem.item.text}
                    primaryTypographyProps={{
                      style: {
                        fontSize: menuStructureItem.item.path === '/settings' ? 15 : 16,
                        lineHeight: menuStructureItem.item.path === '/settings' ? 1.53 : 1.44,
                        letterSpacing: menuStructureItem.item.path === '/settings' ? -0.1 : -0.11,
                        color: menuStructureItem.item.path === '/settings' ? '#1f2933' : '#3e4c59',
                      },
                    }} />
                </ListItem>
              );
            case MenuStructureItemType.MARGIN_TOP_AUTO:
              return (
                <div key={index} style={{ marginTop: 'auto' }} />
              );
            case MenuStructureItemType.LOGO:
              return (
                <div key={index} style={{
                  height: 24,
                  marginLeft: 20,
                  marginBottom: 32,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left center',
                  backgroundSize: 'contain',
                  backgroundImage: 'url(/images/logo-text.svg)',
                }} />
              );
            default:
              console.error('Unknown menu item type', menuStructureItem);
              return null;
          }
        })
      }
    </List>
  </div>
);

class MainDrawer extends Component<RouteComponentProps<{}> & MainDrawerProps, MainDrawerState> {
  toggleDrawer = (open: boolean) => {
    open ? this.props.openDrawer() : this.props.closeDrawer();
  };

  toggleDrawerEvent = (open: boolean) => {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      this.toggleDrawer(open);
    };
  };

  render(): React.ReactElement<MainDrawerProps, React.JSXElementConstructor<MainDrawerState>> {
    const { classes } = this.props;

    return (
      <>
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            open
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer(() => this.toggleDrawer(false))}
          </Drawer>
        </Hidden>
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            open={this.props.drawerIsOpen}
            onClose={this.toggleDrawerEvent(false)}
            onOpen={this.toggleDrawerEvent(true)}
          >
            {drawer(() => this.toggleDrawer(false))}
          </SwipeableDrawer>
        </Hidden>
      </>
    );
  }
}

export const MainDrawerConnected = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(MainDrawer)));
