d3.graph = function (graph, svgElement) {
    var svgSkills = d3.select(svgElement),
        width = +svgSkills.attr("width"),
        height = +svgSkills.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().distance(100).strength(1).id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide(function (d) {
            return d.r + 8
        }).iterations(32))
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svgSkills.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    var node_g = svgSkills.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "cls_node_g")
        .on("mouseout", function (d) {
            customTooltip.hide();
        })
        .on("mousemove", function (d) {
            if (d.fullText) {
                customTooltip.show(d.fullText);
            }
        });

    var node = node_g.append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .attr("fill", function (d) {
            return color(d.group);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var text = node_g
        .append("g");

    text
        .append("text")
        .text(function (d) {
            return d.id;
        })
        .attr("dy", 0)
        .attr("dx", 0)
        .attr("text-anchor", "middle")
        .style("font-family", "Anton")
        .style("font-size", function (d) {
            return d.r / 3 + "px"
        })
        .style("fill", "white")
        .style("text-transform", "uppercase");

    svgSkills.selectAll("text")
        .data(graph.nodes)
        .call(wrap, function (d) {
            return d.r * 2
        });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });

        text
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function wrap(text, width) {
        text.each(function (d) {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1,
                y = text.attr("y"),
                dy = 0.4
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width(d)) {
                    if (line.length > 1) {
                        tspan.node().setAttribute("dy", (dy - 0.55) + "em")
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em").text(word);
                    }
                }
            }
        });
    }
};

/*
d3.json("skills.json", function (error, skills) {
    if (error) throw error;

    d3.graph(skills, "#skills");
});
*/