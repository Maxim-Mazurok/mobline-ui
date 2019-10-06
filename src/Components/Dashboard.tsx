import React, { Component } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import {
  Box,
  Button,
  createStyles,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  StyledComponentProps,
  Typography,
  withStyles,
} from '@material-ui/core';
import { loadStats } from '../actions/loadStats';
import GlobalState, { Competitor } from '../types/GlobalState';
import { loadCompetitors } from '../actions/loadCompetitors';
import { selectCompetitor } from '../actions';
import { grey, red } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import { addCompetitorShowModal } from '../actions/addCompetitor';
import AddIcon from '@material-ui/icons/Add';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';

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

export enum ChartType {
  POSTS_PER_DAY,
  POSTS_PER_WEEK,
  POSTS_PER_MONTH,
}

type DashboardState = {
  chart: ChartType
}

class Dashboard extends Component<DashboardProps, DashboardState> {
  state = {
    chart: ChartType.POSTS_PER_WEEK,
  };

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
    const { classes, loadStatsStats } = this.props;
    const { chart } = this.state;

    let yMax = 0;
    if (loadStatsStats) {
      loadStatsStats[chart].data.datasets.forEach(dataset => dataset.data.forEach(datum => {
        if (datum > yMax) yMax = datum;
      }));
    }

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
                loadStatsStats ?
                  <>
                    <Box my={2}>
                      <div style={{
                        fontSize: 34,
                        fontWeight: 'bold',
                        lineHeight: 1.3,
                        letterSpacing: -0.23,
                        color: '#1f2933',
                      }}>
                        Dashboard
                      </div>
                    </Box>
                    <div style={{
                      borderRadius: 4,
                      border: 'solid 1.2px #f1f5f8',
                    }}>
                      <div style={{
                        backgroundColor: '#f1f5f8',
                        paddingTop: 20,
                        paddingBottom: 20,
                        paddingLeft: 32,
                        paddingRight: 32,
                      }}>
                        <div style={{
                          marginTop: -30,
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                          <FormControl style={{
                            minWidth: 120,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'baseline',
                            borderRadius: 4,
                            border: 'solid 1px #d1e2f5',
                            marginTop: 30,
                          }}>
                            <InputLabel htmlFor="sort" style={{
                              position: 'static',
                              fontSize: 15,
                              letterSpacing: -0.1,
                              color: '#3e4c59',
                              transform: 'none',
                              marginLeft: 10,
                              marginRight: 6,
                            }}>show</InputLabel>
                            <Select
                              autoWidth
                              value={chart}
                              onChange={({ target }) => {
                                this.setState({ chart: target.value as ChartType });
                              }}
                              inputProps={{
                                name: 'chart',
                                id: 'chart',
                              }}
                            >
                              <MenuItem value={ChartType.POSTS_PER_DAY}>Posts per day</MenuItem>
                              <MenuItem value={ChartType.POSTS_PER_WEEK}>Posts per week</MenuItem>
                              <MenuItem value={ChartType.POSTS_PER_MONTH}>Posts per month</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div style={{
                        position: 'relative',
                        padding: '20px 32px',
                        height: '75vh',
                        width: '100%',
                      }}>
                        {chart === 0 && <Line
                          data={loadStatsStats[0].data}
                          options={{
                            responsive: true,
                            elements: {
                              line: {
                                tension: 0.000001,
                              },
                            },
                            annotation: {
                              annotations:
                                (loadStatsStats[0].annotations || []).map(annotation => ({
                                  type: 'box',
                                  xScaleID: 'x-axis-0',
                                  yScaleID: 'y-axis-0',
                                  xMin: annotation.xMin,
                                  xMax: annotation.xMax,
                                  yMin: 0,
                                  yMax,
                                  backgroundColor: 'rgba(254, 3, 89, 0.1)',
                                  borderWidth: 0,
                                  borderColor: 'rgba(0, 0, 0, 0)',
                                })),
                            },
                            legend: {
                              labels: {
                                usePointStyle: true,
                              },
                            },
                            scales: {
                              xAxes: [{
                                gridLines: {
                                  display: false,
                                },
                              }],
                              yAxes: [{
                                ticks: {
                                  beginAtZero: true,
                                  callback: (value: number) => value % 1 === 0 ? value : undefined,
                                },
                                gridLines: {
                                  display: false,
                                },
                              }],
                            },
                          }}
                          plugins={[{
                            beforeInit: function (chart: any) {
                              chart.legend.afterFit = function () {
                                this.height = this.height + 20;
                              };
                            },
                          }]}
                        />}
                        {chart === 1 && <Line
                          data={loadStatsStats[1].data}
                          options={{
                            responsive: true,
                            elements: {
                              line: {
                                tension: 0.000001,
                              },
                            },
                            annotation: {
                              annotations:
                                (loadStatsStats[1].annotations || []).map(annotation => ({
                                  type: 'box',
                                  xScaleID: 'x-axis-0',
                                  yScaleID: 'y-axis-0',
                                  xMin: annotation.xMin,
                                  xMax: annotation.xMax,
                                  yMin: 0,
                                  yMax,
                                  backgroundColor: 'rgba(254, 3, 89, 0.1)',
                                  borderWidth: 0,
                                  borderColor: 'rgba(0, 0, 0, 0)',
                                })),
                            },
                            legend: {
                              labels: {
                                usePointStyle: true,
                              },
                            },
                            scales: {
                              xAxes: [{
                                gridLines: {
                                  display: false,
                                },
                              }],
                              yAxes: [{
                                ticks: {
                                  beginAtZero: true,
                                  callback: (value: number) => value % 1 === 0 ? value : undefined,
                                },
                                gridLines: {
                                  display: false,
                                },
                              }],
                            },
                          }}
                          plugins={[{
                            beforeInit: function (chart: any) {
                              chart.legend.afterFit = function () {
                                this.height = this.height + 20;
                              };
                            },
                          }]}
                        />}
                        {chart === 2 && <Line
                          data={loadStatsStats[2].data}
                          options={{
                            responsive: true,
                            elements: {
                              line: {
                                tension: 0.000001,
                              },
                            },
                            annotation: {
                              annotations:
                                (loadStatsStats[2].annotations || []).map(annotation => ({
                                  type: 'box',
                                  xScaleID: 'x-axis-0',
                                  yScaleID: 'y-axis-0',
                                  xMin: annotation.xMin,
                                  xMax: annotation.xMax,
                                  yMin: 0,
                                  yMax,
                                  backgroundColor: 'rgba(254, 3, 89, 0.1)',
                                  borderWidth: 0,
                                  borderColor: 'rgba(0, 0, 0, 0)',
                                })),
                            },
                            legend: {
                              labels: {
                                usePointStyle: true,
                              },
                            },
                            scales: {
                              xAxes: [{
                                gridLines: {
                                  display: false,
                                },
                              }],
                              yAxes: [{
                                ticks: {
                                  beginAtZero: true,
                                  callback: (value: number) => value % 1 === 0 ? value : undefined,
                                },
                                gridLines: {
                                  display: false,
                                },
                              }],
                            },
                          }}
                          plugins={[{
                            beforeInit: function (chart: any) {
                              chart.legend.afterFit = function () {
                                this.height = this.height + 20;
                              };
                            },
                          }]}
                        />}
                      </div>
                    </div>
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
