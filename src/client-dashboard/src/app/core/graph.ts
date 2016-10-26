var d3 = require('d3');

export class Graph {

  private graph;
  private tip;
  private element;
  private width;
  private height;
  private margins = [80, 80, 80, 80];
  private data;
  private axisY : boolean = false;
  private axisX : boolean = false;

  constructor(params) {
    this.element = params.element;
    this.width = ( window.innerWidth - 50 ) - this.margins[1] - this.margins[3];
    this.height = params.height - this.margins[0] - this.margins[2];  // height

    // Create html element
    this.createGraph();
    this.initTooltip();
    this.data = params.data;
    // for each data set
    this.data.forEach((dataSet) => {
      // calc line function for data
      let line = this.setLineFunc(dataSet, dataSet.data);
      // set dots for lines
      this.setLinePoints(dataSet.name, dataSet.data);
      // create line ( draw line )
      this.createLine(dataSet.name, dataSet.color, line, dataSet.data);
    });
  }

  private initTooltip() {
    this.tip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  /**
   * Get max data for Y
   * - based on all data sets
   * @returns {number}
   */
  private getMaxDataY() {
    var max = 0;
    this.data.forEach((dataSet) => {
      let _max = d3.max(dataSet.data, (d) => {
        return d.value;
      });
      if (_max > max) {
        max = _max;
      }
    })
    return max;
  }

  /**
   * Get max data for X
   * - based on all data sets
   * @returns {number}
   */
  private getMaxDataX() {
    let xMax = 0;
    this.data.forEach((dataSet) => {
      let _max = dataSet.data.length;
      if (_max > xMax) {
        xMax = _max;
      }
    })
    return xMax;
  }

  private getXFunc(){
    return d3.scale.linear().domain([0, this.getMaxDataX()]).range([0, this.width]);
  }

  private getYFunc() {
    return d3.scale.linear().domain([0, this.getMaxDataY()]).range([this.height, 0]);
  }

  private createGraph() {
    this.graph = d3.select(this.element).append("svg:svg")
      .attr("width", this.width + this.margins[1] + this.margins[3])
      .attr("height", this.height + this.margins[0] + this.margins[2])
      .append("svg:g")
      .attr("transform", "translate(" + this.margins[3] + "," + this.margins[0] + ")");
  }

  private setXAxisGraphLine(x) {
    // create
    if (!this.axisX) {
      this.axisX = true;
      var xAxis = (<any>d3.svg.axis().scale(x).tickSize(-this.height)).tickFormat(d3.format("d")).ticks(15);
      this.graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis);
    } else {
      var xAxis = (<any>d3.svg.axis().scale(x).tickSize(-this.height)).tickFormat(d3.format("d")).ticks(15);
      this.graph.selectAll("g .x.axis").call(xAxis);
    }
  }

  private setYAxisGraphLine(y) {
    // create
    if (!this.axisY) {
      this.axisY = true;
      var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left").tickFormat(d3.format("d")).ticks(5);
      this.graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);
      this.graph.append("text")
        .attr('x', '-20px')
        .attr('y', '0')
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text('ms');
    } else {
      var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left").tickFormat(d3.format("d")).ticks(5);
      this.graph.selectAll("g .y.axis").call(yAxisLeft);
    }
  }

  private setLineLabel(dataSet, x, y) {
    if (this.graph.select('.label-'+dataSet.name).empty()) {
      this.graph.append("text")
        .attr('class', 'label-'+dataSet.name)
        .attr('x', x).attr('y', y)
        .style("fill", dataSet.color)
        .text(dataSet.label);
    } else {
      this.graph.select('.label-'+dataSet.name)   // change the line
        .attr('x', x).attr('y', y);
    }
  }

  private setLineFunc(dataSet, data) {
    let x = this.getXFunc();
    let y = this.getYFunc();

    this.setXAxisGraphLine(x);
    this.setYAxisGraphLine(y);
    this.setLineLabel(dataSet, x(data.length - 1), y(data[data.length-1].value));
    return d3.svg.line()
      .x(function(d,i) {
        return x(i);
      })
      .y(function(d) {
        return y(d.value);
      })
  }

  private createLine(name, color, line, data) {
    this.graph.append("svg:path")
      .attr("class", name)
      .style("stroke", color)
      .attr("d", line(data));
  }

  private updateLine(name, line, data) {
    this.graph.select(`.${name}`)   // change the line
      .attr("d", line(data));
  }

  private setLinePoints(name, dataSet) {
    let x = this.getXFunc();
    let y = this.getYFunc();

    var circles = this.graph.selectAll("circle-"+name)
      .data(dataSet)
      .enter()
      .append("circle");

    circles
      .attr("class", "circle")
      .attr("cx", (d, i) => { return x(i) })
      .attr("cy", (d) => { return y(d.value) })
      .attr("stroke", "transparent")
      .attr("stroke-width", "18")
      .attr("r",  (d) => {
        // define dot sizes depends on data size
        let v = d.count;
        let size = 1;
        if(v > 50 ) { size = 2;}
        if(v > 150 ) { size = 4;}
        if(v > 250 ) { size = 6;}
        return size;
      })
      .style("fill", function(d) {
        let type = d.type;
        let color = '#000';
        if(type === 'all') { color = '#C93B37'; }
        if(type === 'add') { color = '#419641'; }
        if(type === 'stream') { color = '#3EB3D7'; }
        return color;
      })
      .on("mouseover", (d) => {
        this.tip
          .transition()
          .duration(200)
          .style("opacity", .9);
        this.tip
          .html(`
              <span class="count">${d.count}</span>
              |
              <span class="time">${d.value}ms</span>
              |
              <span class="type">${d.type}</span>
          `)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", (d) => {
        this.tip
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
  }

  public update(name, newData) {
    // find dataSet
    let dataSet = this.data.filter((data) => {
      if(data.name === name){
        return true;
      }
    })[0];

    newData.forEach((d) => {
      dataSet.data.push(d);
    })

    // clear previous ones
    this.graph.selectAll(".circle").remove();

    // for each data set
    // BUG FIX!
    // do not render just one data set,
    // we have to re-render ALL data set when any data set is changed
    this.data.forEach((dataSet) => {
      let line = this.setLineFunc(dataSet, dataSet.data);
      this.setLinePoints(dataSet.name, dataSet.data);
      this.updateLine(dataSet.name, line, dataSet.data);
    });
  }
}
