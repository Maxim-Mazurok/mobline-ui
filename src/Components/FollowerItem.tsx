import React, { Component } from "react";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { MoreVert, SvgIconComponent, Sync } from "@material-ui/icons";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { Follower } from "../reducers/loadFollowers";

export const verifiedBadge = (Element: keyof JSX.IntrinsicElements, display: "block" | "inline-block" = "block") =>
  <Element
    style={{
      backgroundPosition: "center",
      backgroundSize: "contain",
      backgroundImage: "url(\"/images/verified.png\")",
      backgroundRepeat: "no-repeat",
      height: "1rem",
      width: "1rem",
      marginLeft: "0.25rem",
      verticalAlign: "top",
      display,
    }}
  />;

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {},
    dispatch
  );

export type FollowerItemProps =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {
  follower: Follower,
};

type FollowerItemState =
  & {
  anchorEl: null | HTMLElement,
  open: boolean,
};

type FollowerItemMenuOption = {
  title: string,
  icon: SvgIconComponent,
  id: OptionId,
};

enum OptionId {
  FOLLOWERS,
  SYNC,
  DELETE,
}

const options: FollowerItemMenuOption[] = [
  {
    title: "Sync",
    icon: Sync,
    id: OptionId.SYNC,
  },
];

class FollowerItem extends Component<FollowerItemProps, FollowerItemState> {
  state = {
    anchorEl: null,
    open: false,
  };

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false,
    });
  };

  // noinspection JSUnusedLocalSymbols
  handleSelect = (optionId: OptionId, userPk: Follower["userPk"]) => {
    this.handleClose();
    //TODO: implement

    // noinspection JSRedundantSwitchStatement
    switch (optionId) {
      case OptionId.SYNC:
        //TODO: implement
        break;
      default:
        console.error(`Unknown option selected: ${optionId}`);
    }
  };

  getVerifiedBadge = () => {
    if (this.props.follower.hasOwnProperty("isVerified") && this.props.follower.isVerified === true) {
      return verifiedBadge('div');
    }
  };

  render(): React.ReactElement<FollowerItemProps, React.JSXElementConstructor<FollowerItemState>> {
    return (
      <ListItem
        alignItems={"flex-start"}
      >
        <ListItemAvatar>
          <Avatar alt={this.props.follower.username} src={this.props.follower.profilePicUrl} />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ component: "div", style: { display: "flex", alignItems: "center" } }}
          primary={
            <React.Fragment>
              <div>{this.props.follower.username}</div>
              {this.getVerifiedBadge()}
            </React.Fragment>
          }
          secondary={
            this.props.follower.userPk !== "" ?
              `ID: ${this.props.follower.userPk}`
              :
              "No information yet"
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="More"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={this.state.anchorEl}
            keepMounted
            open={this.state.open}
            onClose={this.handleClose}
          >
            {options.map((option, index) => {
              const Icon = option.icon;
              if (option.id === OptionId.FOLLOWERS && this.props.follower.userPk === "") return null;
              return (
                <MenuItem
                  key={index}
                  onClick={() => this.handleSelect(option.id, this.props.follower.userPk)}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={option.title} />
                </MenuItem>
              );
            })
            }}
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export const FollowerItemConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowerItem);
