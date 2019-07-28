import React, { Component } from "react";
import {
  Avatar,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
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
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {
  competitor: Competitor,
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

  getFollowersListParsedProgress = (): number => {
    if (this.props.competitor.hasOwnProperty('parseFollowersListProgress') && this.props.competitor.parseFollowersListProgress !== undefined) {
      return this.props.competitor.parseFollowersListProgress.done / this.props.competitor.parseFollowersListProgress.total * 100;
    }
    return 0;
  };

  getFollowersListParsedProgressDetailed = (): string => {
    if (this.props.competitor.hasOwnProperty('parseFollowersListProgress') && this.props.competitor.parseFollowersListProgress !== undefined) {
      return `${this.props.competitor.parseFollowersListProgress.done} / ${this.props.competitor.parseFollowersListProgress.total} followers parsed`;
    }
    return "";
  };

  getPostsParsedProgress = (): number => {
    if (this.props.competitor.hasOwnProperty('parsePostsProgress') && this.props.competitor.parsePostsProgress !== undefined) {
      return this.props.competitor.parsePostsProgress.done / this.props.competitor.parsePostsProgress.total * 100;
    }
    return 0;
  };

  getPostsParsedProgressDetailed = (): string => {
    if (this.props.competitor.hasOwnProperty('parsePostsProgress') && this.props.competitor.parsePostsProgress !== undefined) {
      return `${this.props.competitor.parsePostsProgress.done} / ${this.props.competitor.parsePostsProgress.total} pages parsed`;
    }
    return "";
  };

  handleSelect = (optionId: OptionId, userPk: Competitor["userPk"]) => {
    this.handleClose();
    switch (optionId) {
      case OptionId.FOLLOWERS:
        this.props.selectSingleCompetitor(userPk);
        this.props.selectMenu(MenuItemId.FOLLOWERS_EXPLORER);
        break;
      case OptionId.SYNC:
      case OptionId.DELETE:
        //TODO: implement
        break;
      default:
        console.error(`Unknown option selected: ${optionId}`);
    }
  };

  parsingFollowersList = () =>
    (
      (this.props.competitor.hasOwnProperty('parseFollowersListStarted') && this.props.competitor.parseFollowersListStarted)
      || this.getFollowersListParsedProgress() > 0
    ) &&
    !(this.props.competitor.hasOwnProperty('parseFollowersListFinished') && this.props.competitor.parseFollowersListFinished);

  parsingPosts = () =>
    (
      (this.props.competitor.hasOwnProperty('parsePostsStarted') && this.props.competitor.parsePostsStarted)
      || this.getPostsParsedProgress() > 0
    ) &&
    !(this.props.competitor.hasOwnProperty('parsePostsFinished') && this.props.competitor.parsePostsFinished);

  processing = () =>
    this.parsingFollowersList()
    || this.parsingPosts()
  ;

  render(): React.ReactElement<CompetitorItemProps, React.JSXElementConstructor<CompetitorItemState>> {
    return (
      <ListItem
        alignItems={"flex-start"}
      >
        <ListItemAvatar>
          <Avatar alt={this.props.competitor.username} src={this.props.competitor.profilePicUrl} />
        </ListItemAvatar>
        <ListItemText primary={this.props.competitor.username}
                      secondaryTypographyProps={{ component: "div" }}
                      secondary={
                        this.props.competitor.userPk !== ""
                          ?
                          <React.Fragment>
                            {
                              this.processing() ?
                                <React.Fragment>
                                  {
                                    this.parsingFollowersList() &&
                                    <React.Fragment>
                                      Getting followers: {this.getFollowersListParsedProgress() > 0
                                      ? `${this.getFollowersListParsedProgress().toFixed()}% done`
                                      : `initializing...`}
                                      <Tooltip title={this.getFollowersListParsedProgressDetailed()} interactive>
                                        <LinearProgress
                                          variant={this.getFollowersListParsedProgress() > 0 ? "determinate" : "indeterminate"}
                                          value={this.getFollowersListParsedProgress()} />
                                      </Tooltip>
                                    </React.Fragment>
                                  }
                                  {
                                    this.parsingPosts() &&
                                    <React.Fragment>
                                      Getting posts: {this.getPostsParsedProgress() > 0
                                      ? `${this.getPostsParsedProgress().toFixed()}% done`
                                      : `initializing...`}
                                      <Tooltip title={this.getPostsParsedProgressDetailed()} interactive>
                                        <LinearProgress
                                          variant={this.getPostsParsedProgress() > 0 ? "determinate" : "indeterminate"}
                                          value={this.getPostsParsedProgress()} />
                                      </Tooltip>
                                    </React.Fragment>
                                  }
                                </React.Fragment>
                                :
                                this.props.competitor.status
                            }
                          </React.Fragment>
                          :
                          this.props.competitor.status
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
              if (option.id === OptionId.FOLLOWERS && this.props.competitor.userPk === "") return null;
              return (
                <MenuItem
                  key={index}
                  onClick={() => this.handleSelect(option.id, this.props.competitor.userPk)}
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
