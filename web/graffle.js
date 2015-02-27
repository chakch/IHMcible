Raphael.fn.concept = function (x, y, idConcept, typeConcept) {

    var node = {};
    node.idNode = idConcept;
    node.isConcept=true;
    node.typeConcept=typeConcept;
    node.title=typeConcept;
    node.connections = {};
    node.items = {};
    node.items.shape = graph.canvas.rect(x, y, 100, 60, 10);
    var color = Raphael.getColor();
    node.items.shape.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    node.items.label = graph.canvas.text(x + 50, y + 20, node.title).attr({"font-size": "10px", cursor: "pointer"});
    node.items.label.dblclick(function () {
        var name = prompt("Please enter information of " + typeConcept);
    if (name !== "") {
        node.title=name;
        node.items.label.attr({text:node.title});
        node.isConcept=false;
        
    }else {node.items.label.attr({text:node.title});}
    });
    // Start Delete button
    node.items.btnDelete = graph.canvas.text(x + 50, y, "X").attr({"font-size": "15px", cursor: "pointer"});
    node.items.btnDelete.click(function () {
        for (var prop in node.items) {
            node.items[prop].remove();
        }
        for (var prop in node.connections) {
            node.connections[prop].line.remove();
            graph.nodes[prop].connections[node.idNode].line.remove();
            delete graph.nodes[prop].connections[node.idNode];
        }
        delete graph.nodes[node.idNode];
    });
    // End Delete button
    // Start Lien button
    node.items.btnLien = graph.canvas.text(x-5, y + 30, "+").attr({"font-size": "20px", cursor: "pointer"});
node.items.btnLien.toBack();


    lienDragger = function () {
        graph.oldX = node.items.btnLien.attr("x");
        graph.oldY = node.items.btnLien.attr("y");
        this.x = node.items.btnLien.attr("x");
        this.y = node.items.btnLien.attr("y");


    };
    lienMove = function (dx, dy) {
        var att = {x: this.x + dx, y: this.y + dy};
        node.items.btnLien.attr(att);

    };
    lienUp = function () {

        if (graph.mouseoverEL !== null && typeof(node.connections[graph.mouseoverEL])==="undefined") {
            //Object.create();
            node.connections[graph.mouseoverEL]=Object.create(graph.canvas.connection(node.items.shape, graph.nodes[graph.mouseoverEL].items.shape, "#0000CC"));
             graph.nodes[graph.mouseoverEL].connections[node.idNode]=Object.create(graph.canvas.connection(graph.nodes[graph.mouseoverEL].items.shape, node.items.shape, "#0000CC"));
     
        }else{console.info(graph.mouseoverEL);};

        this.attr({x: graph.oldX, y: graph.oldY});
        this.show();
    };
    node.items.btnLien.drag(lienMove, lienDragger, lienUp);

    // End Lien button

    // Start mouseover and mouseout
    mouseover = function () {
        graph.mouseoverEL = node.idNode;
    };
    mouseout = function () {
        graph.mouseoverEL = null;
    };
    node.items.label.mouseover(mouseover);
    node.items.shape.mouseover(mouseover);
    node.items.label.mouseout(mouseout);
    node.items.shape.mouseout(mouseout);
    // End mouseover and mouseout
    // Start drag and drop
    dragger = function () {
        for (var prop in node.items) {
            node.items[prop].hide();
            node.items[prop].x = node.items[prop].attr("x");
            node.items[prop].y = node.items[prop].attr("y");
        }
        node.items.shape.show();
        node.items.label.show();
    };
    move = function (dx, dy) {

        for (var prop in node.items) {
            node.items[prop].hide();
            node.items[prop].attr({
                x: node.items[prop].x + dx,
                y: node.items[prop].y + dy
            })
        }

        node.items.shape.show();
        node.items.label.show();

        for (var prop in node.connections) {
            graph.canvas.connection(node.connections[prop]);
            graph.canvas.connection(graph.nodes[prop].connections[node.idNode]);
        }
        graph.canvas.safari();
    };
    up = function () {
        for (var prop in node.items) {
            node.items[prop].show();
        }
    };
    node.items.shape.drag(move, dragger, up);
    node.items.label.drag(move, dragger, up);
    // Start drag and drop

    return node;
};


Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox(),
            p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
                {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
            d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};
Raphael.fn.inlineTextEditing = function (node) {
    var subject = {};
    subject.inlineTextEditing = {
        input: null,
        /**
         * Start text editing by hiding the current element and adding a text field at the same position
         * @return jQuery input element
         */
        startEditing: function () {
            var originalBbox = node.items.shape.getBBox();
            var width = originalBbox.width;
            var height = originalBbox.height;
            var x = node.items.shape.attr("x");
            var y = node.items.shape.attr("y");
            //subject.hide();

            // Create an input element with theses styles
            this.input = document.createElement("textarea");
            this.input.value = node.items.label.attrs.text;
            //this.input.value = subject.attrs.text ? subject.attrs.text.replace(/\'/g,"\\\'") : '';

            this.input.addEventListener('keyup', this._handleKeyDown.bind(this));
            // Add the input in the container and apply focus on it
            this.input.focus();
            return this.input;
        },
        /**
         * Apply text modification and remove associated input
         */
        stopEditing: function () {

            // Set the new the value
            subject.attr("text", this.input.value);
            // Show the text element
            subject.show();
            // Remove text input
            this.input.parentNode.removeChild(this.input);
        },
        _handleKeyDown: function (e) {
            var tmp = document.createElement("span");
            var text = this.input.value;
            tmp.setAttribute('style', this.input.style.cssText);
            tmp.style.height = null;
            tmp.style.width = null;
            tmp.style.visibility = 'hidden';
            tmp.innerHTML = text.split('\n').join('<br />');
            this.input.parentNode.appendChild(tmp);
            this.input.style.width = tmp.offsetWidth + "px";
            this.input.style.height = tmp.offsetHeight + "px";
            tmp.parentNode.removeChild(tmp);
        }
    };
    return subject.inlineTextEditing;
};

