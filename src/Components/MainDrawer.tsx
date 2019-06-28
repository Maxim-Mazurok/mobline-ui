import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { closeDrawer, openDrawer } from "../actions";
import { Divider, List, ListItemIcon, SwipeableDrawer } from "@material-ui/core";
import { connect } from "react-redux";
import { MenuItem, MenuItemType } from "../App";
import GlobalState from "../types/GlobalState";
import { drawerIsOpen } from "../selectors";

const mapStateToProps = ({ menu }: GlobalState) => ({
  selectedMenuIndex: menu.selectedMenuIndex,
  drawerIsOpen: drawerIsOpen(menu),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      openDrawer,
      closeDrawer,
    },
    dispatch
  );

export type MainDrawerProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  title?: string,
  menuItems: MenuItem[],
};

type MainDrawerState = {}

class MainDrawer extends Component<MainDrawerProps, MainDrawerState> {
  private drawerItemsList = ((): React.ReactElement => {
    return (
      <div
        role="presentation"
        style={{ height: '100%' }}
      >
        <List
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {
            this.props.menuItems.map((menuItem, index) => {
              switch (menuItem.type) {
                case MenuItemType.ITEM:
                  const Icon = menuItem.hasOwnProperty('icon') ? menuItem.icon : null;
                  return (
                    <ListItem button key={index}>
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
    );
  })();

  toggleDrawer(open: boolean) {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      open ? this.props.openDrawer() : this.props.closeDrawer();
    };
  }

  render(): React.ReactElement<MainDrawerProps, React.JSXElementConstructor<MainDrawerState>> {
    return (
      <div>
        <SwipeableDrawer
          open={this.props.drawerIsOpen}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}
        >
          {this.drawerItemsList}
        </SwipeableDrawer>
      </div>
    );
  }
}

export const MainDrawerConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDrawer);
