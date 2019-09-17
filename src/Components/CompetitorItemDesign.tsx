import React, { Component, ReactElement } from 'react';
import {
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import { formatNumber } from './ContentItem';
import { Delete, MoreVert, People, PhotoLibrary, SvgIconComponent, TrendingUp } from '@material-ui/icons';
import { Competitor } from '../types/GlobalState';
import { menuItems } from '../reducers/menu';
import { MenuItemId } from '../defaultState';
import { Path } from 'history';

export type Progress = {
  label: string,
  status: string,
  tooltip: string,
  variant: 'determinate' | 'indeterminate',
  value?: number,
}

type Props = {
  userPk: Competitor['userPk'],
  profilePicUrl: string,
  username: string,
  posts: number,
  followers: number,
  following: number,
  progress?: Progress[],
  selectSingleCompetitor: (competitorPk: Competitor['userPk']) => void,
  deleteCompetitor: (username?: string, userPk?: string) => void,
  historyPush: (path: Path) => void,
}

const profilePicSize = 82;

const Info = ({ value, label }: { value: string, label: string }) => (
  <div style={{
    textAlign: 'center',
  }}>
    <div style={{
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: -0.11,
      color: '#102a43',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: 12,
      lineHeight: 1.4,
      letterSpacing: -0.08,
      color: '#334e68',
    }}>
      {label}
    </div>
  </div>
);

const BorderLinearProgress = withStyles({
  root: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e4ebf2',
  },
  bar: {
    borderRadius: 3,
    backgroundColor: '#fe0359',
  },
})(LinearProgress);

const Progress = ({ label, status, variant, tooltip, value = 0 }: Progress) => (
  <div>
    <div style={{
      fontSize: 13,
      lineHeight: 1.3,
      letterSpacing: -0.09,
      color: '#486581',
      marginBottom: 8,
      marginTop: 16,
    }}>
      {label}{': '}<b>{status}</b>
    </div>
    <Tooltip title={tooltip} interactive>
      <BorderLinearProgress
        variant={variant}
        value={value}
      />
    </Tooltip>
  </div>
);

enum OptionId {
  CONTENT,
  FOLLOWERS,
  ADS,
  DELETE,
}

type CompetitorItemMenuOption = {
  title: string,
  icon: SvgIconComponent,
  id: OptionId,
  color?: 'error',
};

const options: CompetitorItemMenuOption[] = [
  {
    title: 'Content',
    icon: PhotoLibrary,
    id: OptionId.CONTENT,
  },
  {
    title: 'Followers',
    icon: People,
    id: OptionId.FOLLOWERS,
  },
  {
    title: 'Ads',
    icon: TrendingUp,
    id: OptionId.ADS,
  },
  {
    title: 'Delete',
    icon: Delete,
    id: OptionId.DELETE,
    color: 'error',
  },
];

type State =
  & {
  anchorEl: null | HTMLElement,
  open: boolean,
};

export class CompetitorItemDesign extends Component<Props, State> {
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

  handleSelect = (optionId: OptionId, username: Competitor['username'], userPk: Competitor['userPk']) => {
    this.handleClose();
    switch (optionId) {
      case OptionId.CONTENT:
        this.props.selectSingleCompetitor(userPk);
        this.props.historyPush(menuItems[MenuItemId.CONTENT].path);
        break;
      case OptionId.FOLLOWERS:
        this.props.selectSingleCompetitor(userPk);
        this.props.historyPush(menuItems[MenuItemId.FOLLOWERS_EXPLORER].path);
        break;
      case OptionId.ADS:
        this.props.selectSingleCompetitor(userPk);
        this.props.historyPush(menuItems[MenuItemId.ADS].path);
        break;
      case OptionId.DELETE:
        this.props.deleteCompetitor(username, userPk);
        break;
      default:
        console.error(`Unknown option selected: ${optionId}`);
    }
  };

  render(): ReactElement<Props> {
    let {
      userPk,
      profilePicUrl,
      username,
      posts,
      followers,
      following,
      progress,
    } = this.props;
    return (
      <div style={{
        borderRadius: 4,
        boxShadow: '0 8px 24px 0 rgba(16, 42, 67, 0.12)',
        backgroundColor: '#ffffff',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 48,
        maxWidth: 277,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
      }}>
        <IconButton
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
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
            if (option.id === OptionId.CONTENT && userPk === '') return null;
            if (option.id === OptionId.FOLLOWERS && userPk === '') return null;
            if (option.id === OptionId.ADS && userPk === '') return null;
            const color = option.color || 'inherit';
            return (
              <MenuItem
                key={index}
                onClick={() => this.handleSelect(option.id, username, userPk)}
              >
                <ListItemIcon>
                  <Icon color={color} />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ color }} primary={option.title} />
              </MenuItem>
            );
          })
          }}
        </Menu>
        <div style={{
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundImage: `url(${profilePicUrl})`,
          borderRadius: '50%',
          border: '6px solid #f1f5f8',
          width: profilePicSize,
          height: profilePicSize,
          transform: 'translateY(-50%)',
          marginTop: profilePicSize / 2,
          marginBottom: -profilePicSize / 2,
          marginLeft: 'auto',
          marginRight: 'auto',
        }} />
        <div style={{
          fontWeight: 'bold',
          fontSize: 20,
          color: '#102a43',
          textAlign: 'center',
          marginTop: 24,
        }}>
          @{username}
        </div>
        {
          (posts || followers || following) &&
          <div style={{
            borderRadius: 4,
            backgroundColor: '#f1f5f8',
            display: 'flex',
            justifyContent: 'space-evenly',
            paddingTop: 14,
            paddingBottom: 14,
            marginTop: 24,
          }}>
            {posts && <Info
              value={formatNumber(posts)}
              label={'Posts'}
            />}
            {followers && <Info
              value={formatNumber(followers)}
              label={'Followers'}
            />}
            {following && <Info
              value={formatNumber(following)}
              label={'Following'}
            />}
          </div>
        }
        {progress && progress.length > 0 &&
        <div style={{
          marginTop: 32,
        }}>
          {
            progress.map(
              ({ label, status, variant, tooltip, value }: Progress) =>
                <Progress
                  label={label}
                  status={status}
                  variant={variant}
                  tooltip={tooltip}
                  value={value}
                />)
          }
        </div>
        }
      </div>
    );
  }
}
