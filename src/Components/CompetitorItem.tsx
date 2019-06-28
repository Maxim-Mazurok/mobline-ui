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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import SyncIcon from '@material-ui/icons/Sync';
import PeopleIcon from '@material-ui/icons/People';
import { SvgIconComponent } from "@material-ui/icons";

export type CompetitorItemProps =
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
};

const options: CompetitorItemMenuOption[] = [
  {
    title: "Followers",
    icon: PeopleIcon,
  },
  {
    title: "Sync",
    icon: SyncIcon,
  },
  {
    title: "Delete",
    icon: DeleteIcon,
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

  handleSelect = (option: CompetitorItemMenuOption) => {
    this.handleClose();
    console.log(option, "selected");
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
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={this.state.anchorEl}
            keepMounted
            open={this.state.open}
            onClose={this.handleClose}
          >
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <MenuItem
                  key={index}
                  onClick={() => this.handleSelect(option)}
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

export default CompetitorItem;
