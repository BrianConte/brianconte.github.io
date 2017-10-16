/**
 * @author Dimitry Kudrayvtsev
 * @version 2.0
 *
 * Ported to d3 v4 by Keyvan Fatehi on October 16th, 2016
 */

d3.gantt = function () {
  var FIT_TIME_DOMAIN_MODE = "fit";
  var FIXED_TIME_DOMAIN_MODE = "fixed";

  var margin = {
    top: 20,
    right: 40,
    bottom: 20,
    left: 40
  };
  var timeDomainStart = d3.timeDay.offset(new Date(), -3);
  var timeDomainEnd = d3.timeHour.offset(new Date(), +3);
  var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
  var taskTypes = [];
  var taskStatus = [];
  var height = 350 - margin.top - margin.bottom - 5;// document.body.clientHeight - margin.top - margin.bottom-5;
  var width = 600 - margin.right - margin.left - 5;//document.body.clientWidth - margin.right - margin.left-5;

  var tickFormat = "%H:%M";

  var keyFunction = function (d) {
    return d.startDate + d.taskName + d.endDate;
  };

  var rectTransform = function (d) {
    return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
  };

  var x, y, xAxis, yAxis;

  initAxis();

  var initTimeDomain = function () {
    if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
      if (tasks === undefined || tasks.length < 1) {
        timeDomainStart = d3.time.day.offset(new Date(), -3);
        timeDomainEnd = d3.time.hour.offset(new Date(), +3);
        return;
      }
      tasks.sort(function (a, b) {
        return a.endDate - b.endDate;
      });
      timeDomainEnd = tasks[tasks.length - 1].endDate;
      tasks.sort(function (a, b) {
        return a.startDate - b.startDate;
      });
      timeDomainStart = tasks[0].startDate;
    }
  };

  function initAxis() {
    x = d3.scaleTime().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);

    y = d3.scaleBand().domain(taskTypes).rangeRound([0, height - margin.top - margin.bottom], .1);

    xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat(tickFormat))
      .tickSize(8).tickPadding(8);

    yAxis = d3.axisLeft().scale(y).tickSize(0);
  };

  function gantt(tasks) {

    initTimeDomain();
    initAxis();

  /* Initialize tooltip */
  var div = d3.select("body").append("div").attr("class", "nodesToolTip");
  var tip = d3
    .tip()
    /*.offset([-5, 0])*/
    .html(function (d) {
      if (d.fullText)
        return "<div class='nodesToolTip'>" + d.fullText + "</div>";
    });

    var svg = d3.select("#experience")
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "gantt-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      function getNodePos(el)
      {
          var body = d3.select('body').node();
      
          for (var lx = 0, ly = 0;
               el != null && el != body;
               lx += (el.offsetLeft || el.clientLeft), ly += (el.offsetTop || el.clientTop), el = (el.offsetParent || el.parentNode))
              ;
          return {x: lx, y: ly};
      }
      var root = d3.select("svg");
      var scr = { x: window.scrollX, y: window.scrollY, w: window.innerWidth, h: window.innerHeight };
      var body_sel = d3.select('body');
      var body = { w: body_sel.node().offsetWidth, h: body_sel.node().offsetHeight };
      var doc = { w: document.width, h: document.height };
      var svgpos = getNodePos(root.node());
      var dist = { x: 10, y: 10 };
    bar = svg.selectAll(".chart")
      .data(tasks, keyFunction).enter()
      .append("g")
      .attr("class","g_bar")
      //.on('mouseover', tip.show)
      //.on('mouseout', tip.hide)
      .on("mouseout", function(d){
        div.style("display", "none");
      })
      .on("mousemove", function(d){
        if (d.fullText){
          div.style("right", "");
          div.style("left", "");
          div.style("bottom", "");
          div.style("top", "");
          var m = d3.mouse(root.node());
          scr.x = window.scrollX;
          scr.y = window.scrollY;
          m[0] += svgpos.x;
          m[1] += svgpos.y;
          if (m[0] > scr.x + scr.w / 2) {
              div.style("right", (body.w - m[0] + dist.x) + "px");
          }
          else {
              div.style("left", (m[0] + dist.x) + "px");
          }

          if (m[1] > scr.y + scr.h / 2) {
              div.style("bottom", (body.h - m[1] + dist.y) + "px");
          }
          else {
              div.style("top", (m[1] + dist.y) + "px");
          }
          //div.style("left", d3.event.pageX+10+"px");
          //div.style("top", d3.event.pageY-25+"px");
          div.style("display", "inline-block");
          div.html(d.fullText);
        }
        /*var xPosition = d3.mouse(this)[0] - 15;
        var yPosition = d3.mouse(this)[1] - 25;
        console.log(d3.event.pageY-25, d3.event.pageX+10)
        tip.offset([d3.event.pageX+10,d3.event.pageY-25]);*/
    });
      
    bar.append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", function (d) {
        if (taskStatus[d.status] == null) { return "bar"; }
        return taskStatus[d.status];
      })
      .attr("y", 0)
      .attr("transform", rectTransform)
      .attr("height", function (d) { return 30; })
      .transition().duration(700)
      .attr("width", function (d) {
        return (x(d.endDate) - x(d.startDate));
      });

    bar.append("text")
      .attr("class", "barText")
      .attr("transform", rectTransform)
      .attr("x", 5)
      .attr("y", 20)
      .attr("fill", "white")
      .attr("text-anchor", "start")
      .attr("font-family", "Anton")
      .text(function(d) { return d.taskName; });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
      .transition()
      .call(xAxis);

    //      svg.append("g").attr("class", "y axis").transition().call(yAxis);


    

    /* Invoke the tip in the context of your visualization */
    svg.call(tip)

    return gantt;

  };

  gantt.redraw = function (tasks) {

    initTimeDomain();
    initAxis();

    var svg = d3.select("#experience > svg");

    var ganttChartGroup = svg.select(".gantt-chart");
    var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

    rect.enter()
      .insert("rect", ":first-child")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", function (d) {
        if (taskStatus[d.status] == null) { return "bar"; }
        return taskStatus[d.status];
      })
      .transition()
      .attr("y", 0)
      .attr("transform", rectTransform)
      .attr("height", function (d) { return y.range()[1]; })
      .attr("width", function (d) {
        return (x(d.endDate) - x(d.startDate));
      });

    rect.transition()
      .attr("transform", rectTransform)
      .attr("height", function (d) { return y.range()[1]; })
      .attr("width", function (d) {
        return (x(d.endDate) - x(d.startDate));
      });

    rect.exit().remove();

    svg.select(".x").transition().call(xAxis);
    svg.select(".y").transition().call(yAxis);

    return gantt;
  };

  gantt.margin = function (value) {
    if (!arguments.length)
      return margin;
    margin = value;
    return gantt;
  };

  gantt.timeDomain = function (value) {
    if (!arguments.length)
      return [timeDomainStart, timeDomainEnd];
    timeDomainStart = +value[0], timeDomainEnd = +value[1];
    return gantt;
  };

  /**
* @param {string}
*                vale The value can be "fit" - the domain fits the data or
*                "fixed" - fixed domain.
*/
  gantt.timeDomainMode = function (value) {
    if (!arguments.length)
      return timeDomainMode;
    timeDomainMode = value;
    return gantt;

  };

  gantt.taskTypes = function (value) {
    if (!arguments.length)
      return taskTypes;
    taskTypes = value;
    return gantt;
  };

  gantt.taskStatus = function (value) {
    if (!arguments.length)
      return taskStatus;
    taskStatus = value;
    return gantt;
  };

  gantt.width = function (value) {
    if (!arguments.length)
      return width;
    width = +value;
    return gantt;
  };

  gantt.height = function (value) {
    if (!arguments.length)
      return height;
    height = +value;
    return gantt;
  };

  gantt.tickFormat = function (value) {
    if (!arguments.length)
      return tickFormat;
    tickFormat = value;
    return gantt;
  };

  return gantt;
};
