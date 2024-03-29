#TODOs:
- Tests:
    - [ ] Write test plan
    - [ ] Write tests
- Better UI:
    - [ ] Hide long descriptions for posts (make expandable)
    - [ ] Always show side bar menu
    - [ ] On competitors page, show some more info (followers number, etc)
    - [ ] Add posted account to Content page
    - [ ] Add posted time to Content page
    - [ ] Add filter (from date to date)
    - [x] Add links in Follower Insights
        - [ ] Should we also add them for competitors?
    - [ ] Create settings page (account info, logout and current subscription plan)
- Better UX:
    - [ ] Show "deleting" state for competitor (don't just delete it from UI while request is going, show loading, or something...)
    - [ ] Add [intro screens](https://mui.wertarbyte.com/#material-auto-rotating-carousel)
    - [x] Add sorting by date, engagementRate, likes and comments
    - [x] Increase session duration. Inactivity timeout - 3 days, require log in after 30 days, [docs](https://auth0.com/docs/dashboard/guides/tenants/configure-session-lifetime-settings)
      - [ ] It doesn't work, maybe we should restore session manually?
- Bugs:
    - [ ] (low priority) if video in Slick slider - three dots (download + PIP) in controls can't be clicked in single item and messes up when multiple items. Possible solution - replace slick with other lib.
    - [ ] When adding competitor, two gets added to UI
    - [x] Fix redirect URL mismatch on auth
- WS-related:
    - [ ] Detect online/offline to reconnect the websocket - [example](https://github.com/jsmanifest/ws-online-sync)
    - [ ] Reconnect to WS on disconnect
    - [ ] Maybe replace WS setTimeout awaiting with action queue system 
- Optimizations:
    - [ ] Don't send request to get followers when no competitor is selected
    - [ ] Create *real* pagination for content/followers on the backend
    - [ ] Debounce competitors selection on content/followers page
    - [ ] Cancel ongoing request on change of competitors selection on content/followers page
    - [ ] (low priority, already optimized using another approach) Don't reload competitors when navigating, instead, show current and sync them on the background
    - [x] Create pagination for Follower insights and content (using `react-infinite-scroller`)
- Deployment:
    - [x] Don't save customerId to localstorage (in case of DB reset it will give major headache) - done for dev mode
    - [x] Show exactly which accounts user follows in Follower Insights
    - [ ] Dashboard
        - [ ] Show post dynamics (number of posts per day)
        - [ ] (advanced) Maximum dynamics by auto updating data
    - [ ] Add sorting by views count to Feed Ads and Content

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
