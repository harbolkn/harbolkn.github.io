var draw_graph = function(selection, graph) {
    var width=300, height = 244;

    var a_matrix = d3.select(selection);

    var data = {"nodes":new Array(), "links":new Array()};
    for(var i=0; i<graph.dimensions().rows; i++){
        data.nodes.push({"name": i});

        for(var j=0; j<graph.dimensions().cols; j++){
            if(graph.elements[i][j]){
                data.links.push({"source": i, "target": j});
            }
        }
    }

    var svg = a_matrix.append("div")
    .attr("class", "graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    var force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width-10, height-10]);

    force.nodes(data.nodes)
    .links(data.links)
    .start();

    var link = svg.selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", 1);

    var node = svg.selectAll("gnode")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 10)
    .attr("fill", "steelblue")
    .call(force.drag);

    var text = svg.selectAll("text.label")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(function(d){ return d.name+1; });

    force.on("tick", function(){
        link.attr("x1", function(d){ return d.source.x;})
        .attr("y1", function(d){ return d.source.y;})
        .attr("x2", function(d){ return d.target.x;})
        .attr("y2", function(d){ return d.target.y;});

        node.attr("cx", function(d){ return d.x;})
        .attr("cy", function(d){ return d.y;});

        text.attr("transform", function(d){
            return "translate(" + (d.x-3.5) + "," + (d.y+3.5) + ")";    
        });
    });

    // Draw Matrix
    var matrix = a_matrix.append("div")
    .attr("class", "matrix");

    var color = d3.scale.linear()
    .domain([1,0])
    .range(["#8C8C8C", "#F0F0F0"]);

    var table = matrix.append("table").append("tbody");
    var row = table.append("tr");
    row.append("td");
    for(var i=0; i<graph.dimensions().rows; i++){
        row.append("td").text(i+1);
    }

    for(var i=0; i<graph.dimensions().rows; i++){
        row = table.append("tr");
        row.append("td").text(i+1);
        for(var j=0; j<graph.dimensions().rows; j++){
            row.append("td")
            .attr("class", "cell")
            .style("background-color", color(graph.elements[i][j]))
            .text(graph.elements[i][j]);
        }
    }
}
