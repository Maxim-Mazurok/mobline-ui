import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

export type SettingsProps =
  & {};

type SettingsState = {}

function Settings(): React.ReactElement<SettingsProps, React.JSXElementConstructor<SettingsState>> {
  return (
    <>
      <div style={{
        fontSize: 34,
        fontWeight: 'bold',
        lineHeight: 1.3,
        letterSpacing: -0.23,
        color: '#1f2933',
      }}>
        Settings
      </div>
      <div>Coming soon...</div>
    </>
  );
}


export const SettingsConnected = connect()(
  withRouter(Settings),
);
