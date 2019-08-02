import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { closeDrawer, openDrawer } from "../actions";
import { Divider, List, ListItemIcon, SwipeableDrawer } from "@material-ui/core";
import { connect } from "react-redux";
import GlobalState from "../types/GlobalState";
import { drawerIsOpen } from "../selectors";
import { menuStructure, MenuStructureItemType } from "../reducers/menu";
import { RouteComponentProps, withRouter } from "react-router";
import { NavLink, NavLinkProps } from "react-router-dom";

const mapStateToProps = ({ menu }: GlobalState) => ({
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
};

type MainDrawerState = {}

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
    const CollisionLink = React.forwardRef((props: NavLinkProps, ref: React.Ref<HTMLAnchorElement>) => (
      <NavLink innerRef={ref} {...props} />
    ));

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
                menuStructure.map((menuStructureItem, index) => {
                  switch (menuStructureItem.type) {
                    case MenuStructureItemType.ITEM:
                      return (
                        <ListItem
                          key={index}
                          button
                          component={CollisionLink}
                          activeClassName={"Mui-selected"}
                          to={menuStructureItem.item.path}
                          exact
                          onClick={() => this.toggleDrawer(false)}
                        >
                          <ListItemIcon>
                            <menuStructureItem.item.icon />
                          </ListItemIcon>
                          <ListItemText primary={menuStructureItem.item.text} />
                        </ListItem>
                      );
                    case MenuStructureItemType.DIVIDER:
                      return (
                        <Divider key={index} />
                      );
                    case MenuStructureItemType.MARGIN_TOP_AUTO:
                      return (
                        <div key={index} style={{ marginTop: 'auto' }} />
                      );
                    default:
                      console.error(`Unknown menu item type: ${menuStructureItem.type}`, menuStructureItem);
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

export const MainDrawerConnected = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDrawer));
