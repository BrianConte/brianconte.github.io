d3.customTooltip = function () {
    var div = d3.select("body").append("div").attr("class", "nodesToolTip");
    function customTooltip() {
      div = d3.select("body").append("div").attr("class", "nodesToolTip");
    }

    function getNodePos(el) {
      var body = d3.select('body').node();

      for (var lx = 0, ly = 0;
        el != null && el != body;
        lx += (el.offsetLeft || el.clientLeft), ly += (el.offsetTop || el.clientTop), el = (el.offsetParent || el.parentNode))
        ;
      return { x: lx, y: ly };
    }
    
    var root = d3.select("svg");
    var scr = { x: window.scrollX, y: window.scrollY, w: window.innerWidth, h: window.innerHeight };
    var body_sel = d3.select('body');
    var body = { w: body_sel.node().offsetWidth, h: body_sel.node().offsetHeight };
    var doc = { w: document.width, h: document.height };
    var svgpos = getNodePos(root.node());
    var dist = { x: 10, y: 10 };

    customTooltip.show = function (info) {
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
      div.style("display", "inline-block");
      div.html(info);
    };

    customTooltip.hide = function () {
      div.style("display", "none");
    };

    return customTooltip;
  };