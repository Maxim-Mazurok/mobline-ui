import React, { Component } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Button, createStyles, LinearProgress, StyledComponentProps, Typography, withStyles } from '@material-ui/core';
import { loadStats } from '../actions/loadStats';
import GlobalState, { Competitor } from '../types/GlobalState';
import { loadCompetitors } from '../actions/loadCompetitors';
import { selectCompetitor } from '../actions';
import { grey, red } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import { addCompetitorShowModal } from '../actions/addCompetitor';
import AddIcon from '@material-ui/icons/Add';
import { Line } from 'react-chartjs-2';

const styles = () =>
  createStyles({
    noCompetitorsFound: {
      color: grey[600],
    },
    noContentsFound: {
      color: grey[600],
    },
    errorMessage: {
      color: red[900],
    },
  });

const mapStateToProps = ({ loadStats, contentExplorer, loadCompetitors }: GlobalState) => ({
  loadCompetitorsError: loadCompetitors.error,
  loadCompetitorsCompetitors: loadCompetitors.competitors,
  loadCompetitorsLoading: loadCompetitors.loading,
  loadStatsError: loadStats.error,
  loadStatsStats: loadStats.stats,
  loadStatsLoading: loadStats.loading,
  contentExplorerSelectedCompetitors: contentExplorer.selectedCompetitors,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadStats,
      loadCompetitors,
      selectCompetitor,
      addCompetitorShowModal,
    },
    dispatch,
  );

export type DashboardProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    errorMessage: string,
    noCompetitorsFound: string,
    noContentsFound: string,
  },
};

type DashboardState = {}

class Dashboard extends Component<DashboardProps, DashboardState> {
  componentDidUpdate(prevProps: DashboardProps) {
    // TODO(repetition): make it generic for Dashboard, Content, Followers, etc.
    // TODO(repetition): think about merging this with componentDidMount to eliminate repetition
    if (this.props.contentExplorerSelectedCompetitors.length === 0 && this.props.loadCompetitorsCompetitors.length > 0) {
      // preselect first competitor (when navigating from followers explorer, for example)
      this.props.loadCompetitorsCompetitors.map((competitor: Competitor) => this.props.selectCompetitor(competitor.userPk));
    } else if (
      prevProps.contentExplorerSelectedCompetitors !== this.props.contentExplorerSelectedCompetitors
      && this.props.contentExplorerSelectedCompetitors.length > 0
    ) {
      // if selected competitors are changed, reload content
      this.props.loadStats();
    }
  }

  componentDidMount(): void {
    if (this.props.contentExplorerSelectedCompetitors.length === 0 && this.props.loadCompetitorsCompetitors.length > 0) {
      // preselect first competitor (when navigating from followers explorer, for example)
      this.props.loadCompetitorsCompetitors.map((competitor: Competitor) => this.props.selectCompetitor(competitor.userPk));
    } else if (this.props.loadCompetitorsCompetitors.length === 0) {
      // if competitors list is not loaded - load it (when navigating directly)
      this.props.loadCompetitors();
    } else {
      // when competitors are loaded and selected - load content
      // TODO(optimization): load only if selected competitors changed (when navigating here, then to other page and then back here without changing selected competitors)
      this.props.loadStats();
    }
  }

  render(): React.ReactElement<DashboardProps, React.JSXElementConstructor<DashboardState>> {
    const { classes } = this.props;

    return (
      this.props.loadCompetitorsLoading ?
        <LinearProgress />
        :
        this.props.loadCompetitorsError ?
          <Typography
            variant="h5"
            gutterBottom
            className={classes.errorMessage}
          >
            {this.props.loadCompetitorsError}
          </Typography>
          :
          this.props.loadCompetitorsCompetitors.length > 0 ?
            this.props.loadStatsLoading ?
              <LinearProgress />
              :
              this.props.loadStatsError ?
                <Typography
                  variant="h5"
                  gutterBottom
                  className={classes.errorMessage}
                >
                  {this.props.loadStatsError}
                </Typography>
                :
                this.props.loadStatsStats.length > 0 ?
                  <>
                    <Typography
                      variant="h2"
                    >
                      Posts per day
                    </Typography>
                    <Line data={this.props.loadStatsStats[0]} />
                  </>
                  : <Typography
                    color="textSecondary"
                    variant="h5"
                    gutterBottom
                    className={classes.noContentsFound}
                  >
                    No stats found.
                  </Typography>
            : <Typography
              variant="h5"
              gutterBottom
              className={classes.noCompetitorsFound}
            >
              No competitors found, <Button
              variant="outlined"
              onClick={() => this.props.addCompetitorShowModal()}
            >
              <AddIcon />
              add new competitor
            </Button> first.
            </Typography>
    );
  }
}


export const DashboardConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Dashboard));
