/// <reference path='../../../../../../typings/index.d.ts' />
import * as Vue from 'vue';
import Sockets from '../../core/sockets';
import { Graph } from '../../core/graph';
import * as moment from 'moment';

Vue.component('graph', {
  template: require('./index.html'),
  data() {
    let sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      sockets.get().on('_done', (res) => {
        let momentEmitted = moment(res.data.timestamps.emitted);
        let momentBeforeRender = moment(res.data.timestamps.beforeRender);
        let momentAfterRender = moment(res.data.timestamps.afterRender);

        let durationEmitted = momentAfterRender.diff(momentEmitted, 'milliseconds');
        let durationRender = momentAfterRender.diff(momentBeforeRender, 'milliseconds');
        let count = res.data.count.current;
        let type = res.data.type;
        // update graph
        this.graph.update(res.name, [{
          value: durationEmitted,
          count: count,
          type: type
        }]);
        this.graph2.update(res.name, [{
          value: durationRender,
          count: count,
          type: type
        }]);
      });
    })
    return {}
  },
  mounted: function () {
    /**
     * Lets initialize the graph,
     * all diff types of graphs has to be pre created, and also 2 set of data is required (0,1)
     * - that is an issue atm, maybe we will fix it later to start with no data at all
     * @type {Graph}
     */
    this.graph = new Graph({
      element: '#graph',
      height: 600,
      data: [
        {
          name: 'vue',
          label: 'vue',
          color: '#00C180',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'react',
          label: 'react',
          color: '#4AD5FF',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'js',
          label: 'vanilla',
          color: '#b19300',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'ng',
          label: 'angular2',
          color: '#9E3D34',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'ng1',
          label: 'angular',
          color: '#DC1A10',
          data: [{
            value : 0,
            count : 0
          }]
        }
      ]
    });
    this.graph2 = new Graph({
      element: '#graph2',
      height: 600,
      data: [
        {
          name: 'vue',
          label: 'vue',
          color: '#00C180',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'react',
          label: 'react',
          color: '#4AD5FF',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'js',
          label: 'vanilla',
          color: '#b19300',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'ng',
          label: 'angular2',
          color: '#9E3D34',
          data: [{
            value : 0,
            count : 0
          }]
        },
        {
          name: 'ng1',
          label: 'angular',
          color: '#DC1A10',
          data: [{
            value : 0,
            count : 0
          }]
        }
      ]
    });
  }
});
