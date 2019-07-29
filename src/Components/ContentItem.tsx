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
import { Content } from "../reducers/loadContent";
import { Competitor } from "../types/GlobalState";

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

export type ContentItemProps =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {
  content: Content,
};

type ContentItemState =
  & {
  anchorEl: null | HTMLElement,
  open: boolean,
};

type ContentItemMenuOption = {
  title: string,
  icon: SvgIconComponent,
  id: OptionId,
};

enum OptionId {
  CONTENTS,
  SYNC,
  DELETE,
}

const options: ContentItemMenuOption[] = [
  {
    title: "Sync",
    icon: Sync,
    id: OptionId.SYNC,
  },
];

class ContentItem extends Component<ContentItemProps, ContentItemState> {
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
  handleSelect = (optionId: OptionId, userPk: Competitor["userPk"]) => {
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

  render(): React.ReactElement<ContentItemProps, React.JSXElementConstructor<ContentItemState>> {
    return (
      <ListItem
        alignItems={"flex-start"}
      >
        <ListItemAvatar>
          <Avatar alt={this.props.content.caption || ""} src={this.props.content.content[0].url} />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ component: "div", style: { display: "flex", alignItems: "center" } }}
          primary={
            <React.Fragment>
              <div>{this.props.content.caption}</div>
            </React.Fragment>
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
              if (option.id === OptionId.CONTENTS && this.props.content.pk === "") return null;
              return (
                <MenuItem
                  key={index}
                  onClick={() => this.handleSelect(option.id, this.props.content.pk)}
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

export const ContentItemConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentItem);
