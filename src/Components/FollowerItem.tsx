import React, { Component } from 'react';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Follower } from '../reducers/loadFollowers';

export const verifiedBadge = (Element: keyof JSX.IntrinsicElements, display: 'block' | 'inline-block' = 'block') =>
  <Element
    style={{
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundImage: 'url("/images/verified.png")',
      backgroundRepeat: 'no-repeat',
      height: '1rem',
      width: '1rem',
      marginLeft: '0.25rem',
      verticalAlign: 'top',
      display,
    }}
  />;

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {},
    dispatch,
  );

export type FollowerItemProps =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {
  follower: Follower,
};

type FollowerItemState =
  & {};

class FollowerItem extends Component<FollowerItemProps, FollowerItemState> {
  getVerifiedBadge = () => {
    if (this.props.follower.hasOwnProperty('isVerified') && this.props.follower.isVerified === true) {
      return verifiedBadge('div');
    }
  };

  render(): React.ReactElement<FollowerItemProps, React.JSXElementConstructor<FollowerItemState>> {
    const { follower } = this.props;

    return (
      <ListItem
        alignItems={'flex-start'}
      >
        <ListItemAvatar>
          <Avatar alt={follower.username} src={follower.profilePicUrl} />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ component: 'div', style: { display: 'flex', alignItems: 'center' } }}
          primary={
            <React.Fragment>
              <div>{follower.username}</div>
              {this.getVerifiedBadge()}
            </React.Fragment>
          }
          secondary={follower.following.join(', ')}
        />
      </ListItem>
    );
  }
}

export const FollowerItemConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowerItem);
