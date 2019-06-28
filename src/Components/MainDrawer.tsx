import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { closeDrawer, openDrawer, selectMenu } from "../actions";
import { Divider, List, ListItemIcon, SwipeableDrawer } from "@material-ui/core";
import { connect } from "react-redux";
import GlobalState from "../types/GlobalState";
import { drawerIsOpen } from "../selectors";
import { menuItems, MenuItemType } from "../reducers/menu";
import isEqual from "lodash.isequal";

const mapStateToProps = ({ menu }: GlobalState) => ({
  selectedMenuItem: menu.selectedMenuItem,
  drawerIsOpen: drawerIsOpen(menu),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      openDrawer,
      closeDrawer,
      selectMenu,
    },
    dispatch
  );

export type MainDrawerProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  title?: string,
};

type MainDrawerState = {}

class MainDrawer extends Component<MainDrawerProps, MainDrawerState> {
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
    return (
      <div>
        <SwipeableDrawer
          open={this.props.drawerIsOpen}
          onClose={this.toggleDrawerEvent(false)}
          onOpen={this.toggleDrawerEvent(true)}
        >
          <div
            role="presentation"
            style={{ height: '100%' }}
          >
            <List
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {
                menuItems.map((menuItem, index) => {
                  switch (menuItem.type) {
                    case MenuItemType.ITEM:
                      const Icon = menuItem.hasOwnProperty('icon') ? menuItem.icon : null;
                      return (
                        <ListItem
                          selected={isEqual(this.props.selectedMenuItem, menuItem)}
                          button
                          key={index}
                          onClick={() => {
                            this.props.selectMenu(menuItem);
                            this.toggleDrawer(false);
                          }}
                        >
                          {Icon && <ListItemIcon><Icon /></ListItemIcon>}
                          <ListItemText primary={menuItem.text} />
                        </ListItem>
                      );
                    case MenuItemType.DIVIDER:
                      return (
                        <Divider key={index} />
                      );
                    case MenuItemType.MARGIN_TOP_AUTO:
                      return (
                        <div key={index} style={{ marginTop: 'auto' }} />
                      );
                    default:
                      console.error(`Unknown menu item type: ${menuItem.type}`, menuItem);
                      return null;
                  }
                })
              }
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

export const MainDrawerConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDrawer);
