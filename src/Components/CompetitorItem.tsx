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
import { Delete, MoreVert, People, SvgIconComponent, Sync } from "@material-ui/icons";
import { connect } from "react-redux";
import { Competitor } from "../types/GlobalState";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { selectMenu, selectSingleCompetitor } from "../actions";
import { MenuItemId } from "../reducers/menu";

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      selectSingleCompetitor,
      selectMenu,
    },
    dispatch
  );

export type CompetitorItemProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {
  username: string,
  profilePicUrl: string,
  userPk: string,
  status: string,
};

type CompetitorItemState =
  & {
  anchorEl: null | HTMLElement,
  open: boolean,
};

type CompetitorItemMenuOption = {
  title: string,
  icon: SvgIconComponent,
  id: OptionId,
};

enum OptionId {
  FOLLOWERS,
  SYNC,
  DELETE,
}

const options: CompetitorItemMenuOption[] = [
  {
    title: "Followers",
    icon: People,
    id: OptionId.FOLLOWERS,
  },
  {
    title: "Sync",
    icon: Sync,
    id: OptionId.SYNC,
  },
  {
    title: "Delete",
    icon: Delete,
    id: OptionId.DELETE,
  },
];

class CompetitorItem extends Component<CompetitorItemProps, CompetitorItemState> {
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

  handleSelect = (optionId: OptionId, userPk: Competitor["userPk"]) => {
    this.handleClose();
    switch (optionId) {
      case OptionId.FOLLOWERS:
        this.props.selectSingleCompetitor(userPk);
        this.props.selectMenu(MenuItemId.EXPLORER);
        break;
      case OptionId.SYNC:
      case OptionId.DELETE:
        console.log('TODO: implement');
        break;
      default:
        console.error(`Unknown option selected: ${optionId}`);
    }
  };

  render(): React.ReactElement<CompetitorItemProps, React.JSXElementConstructor<CompetitorItemState>> {
    return (
      <ListItem
        alignItems={"flex-start"}
      >
        <ListItemAvatar>
          <Avatar alt={this.props.username} src={this.props.profilePicUrl} />
        </ListItemAvatar>
        <ListItemText primary={this.props.username}
                      secondary={
                        this.props.userPk !== "" ?
                          `ID: ${this.props.userPk}`
                          :
                          this.props.status && this.props.status
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
              if (option.id === OptionId.FOLLOWERS && this.props.userPk === "") return null;
              return (
                <MenuItem
                  key={index}
                  onClick={() => this.handleSelect(option.id, this.props.userPk)}
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

export const CompetitorItemConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompetitorItem);
