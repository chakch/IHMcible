/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Raphael.fn.node = function (x, y, idNode, classeNode) {

    var node = {};
    node.id = idNode ? idNode : "Concept-" + self.nbConcept;
    node.toResearch = 1;
    node.nameNode = null;
    node.classeNode = classeNode ? classeNode + "?" : null;
    node.nbRelatioin = 0;

    node.items = {};//shape, label, btnDelete
    node.deleteItems = {};

    self.c.nodes[node.id] = node;

    var h = 86;
    var w = 170;


    //---------------------------------------create the components of the node idea-------------------------------------------------// 
    if (node.toResearch == 1)
        node.items.shape = self.c.paper.image("resources/community/style/image/dsresearch/Blue_node3.png", x, y, w, h).attr({cursor: "move"});
    else
        node.items.shape = self.c.paper.image("resources/community/style/image/dsresearch/node-c.png", x, y, w, h).attr({cursor: "move"});

    node.items.label = self.c.paper.text(x + w / 2, y + h / 2 - 5, node.classeNode).attr({"font-size": "15px", cursor: "pointer"});
    //node.items.btnAdd = self.c.paper.image("resources/community/style/image/dsresearch/add.png", x + w / 2 - 10, y + h - 35, 20, 20).attr({cursor: "pointer"});
    node.items.btnDelete = self.c.paper.image("resources/community/style/image/dsresearch/delete.png", x + w / 2 - 10, y + 10, 20, 20).attr({cursor: "pointer"});
    //node.items.btnExpand = self.c.paper.image("resources/community/style/image/dsresearch/expand.png", x + 10, y + h / 2 - 10, 20, 20).attr({cursor: "pointer"});
    //node.items.btnCollapse = self.c.paper.image("resources/community/style/image/dsresearch/collapse.png", x + 10, y + h / 2 - 10, 20, 20).attr({cursor: "pointer"});
    //node.items.btnHighLight = self.c.paper.image("resources/community/style/image/dsresearch/path.png", x + w - 30, y + h / 2 - 10, 20, 20).attr({cursor: "pointer"});
    //node.items.tags = self.c.paper.text(node.items.shape.attr("x") + 170, node.items.shape.attr("y"), "Tags:\n" + node.tags.toString()).attr({width: 50, "font-size": "15px", "text-anchor": "start", fill: "white"});
    //node.items.note = self.c.paper.image("resources/community/style/image/dsresearch/note.png", x, y, 40, 40).attr({cursor: "pointer"});

    node.deleteItems.deleteNodeBtn = self.c.paper.image("resources/community/style/image/dsresearch/write_delete_node.png", x + 25, y + 10, 120, 20).attr({cursor: "pointer"});
    node.deleteItems.deleteBranchBtn = self.c.paper.image("resources/community/style/image/dsresearch/write_delete_branch.png", x + 25, y + 10, 120, 20).attr({cursor: "pointer"});

    for (var prop in node.deleteItems) {
        node.deleteItems[prop].hide();
        node.deleteItems[prop].mouseover(function () {
            node.items.shape.show();
            node.items.label.show();
            node.items.btnDelete.show();
            this.show();
        });
        node.deleteItems[prop].mouseout(function () {
            this.hide();
        });
    }

    for (prop in node.items)
        node.items[prop].hide();
    node.items.shape.show();
    node.items.label.show();

    //-END--------------------------------------create the components of the node idea-------------------------------------------------// 

    //---------------------------------------configure the actions of the components -------------------------------------------------//
    var mouseover = function () {
        self.c.mouseoverObj = node.id;

        if (self.c.drag == 0) {
            for (var prop in node.items)
                node.items[prop].show();
        }

    }
    var mouseout = function () {
            for (var prop in node.items)
                node.items[prop].hide();
            node.items.shape.show();
            node.items.label.show();        

    }

    for (prop in node.items) {

        node.items[prop].mouseover(mouseover);
        node.items[prop].mouseout(mouseout);
    }


    /*
     ** drag and drop 
     **/
    var xOld;
    var yOld;
    dragger = function () {
        self.c.drag = 1;
        xOld = node.items.shape.attr("x");
        yOld = node.items.shape.attr("y");
        for (var prop in node.items) {
            node.items[prop].hide();
            node.items[prop].ox = node.items[prop].attr("x");
            node.items[prop].oy = node.items[prop].attr("y");
        }
        for (var prop in node.deleteItems) {
            node.deleteItems[prop].ox = node.deleteItems[prop].attr("x");
            node.deleteItems[prop].oy = node.deleteItems[prop].attr("y");
        }

        node.items.shape.show();
        node.items.label.show();
    };
    move = function (dx, dy) {

        for (var prop in node.items) {
            node.items[prop].hide();
            node.items[prop].attr({
                x: node.items[prop].ox + dx * self.c.zoom,
                y: node.items[prop].oy + dy * self.c.zoom
            })
        }
        for (var prop in node.deleteItems) {
            node.deleteItems[prop].attr({
                x: node.deleteItems[prop].ox + dx * self.c.zoom,
                y: node.deleteItems[prop].oy + dy * self.c.zoom
            })
        }

        node.items.shape.show();
        node.items.label.show();
        
        for (prop in self.c.connections)
            self.c.paper.connectionC(self.c.connections[prop]);

        self.c.paper.safari();
    };
    up = function () {
        self.c.drag = 0;
        for (var prop in node.items) {
            node.items[prop].show();
        }
    };
    node.items.shape.drag(move, dragger, up);
    node.items.label.drag(move, dragger, up);
    /*** END drag and drop*/

var btnDeleteClick = function (owner) {

        self.c.connections[owner.id].pd.remove();
        self.c.connections[owner.id].line.remove();
        delete self.c.connections[owner.id];

        for (var m = 0; m < self.c.nodes[owner.id].tags.length; m++) {
            self.c.tags[self.c.nodes[owner.id].tags[m]].nodes.splice(self.c.tags[self.c.nodes[owner.id].tags[m]].nodes.indexOf(owner.id), 1);
            if (!self.c.tags[self.c.nodes[owner.id].tags[m]].nodes.length) {
                delete self.c.tags[self.c.nodes[owner.id].tags[m]];
                var btn = document.getElementById(self.c.nodes[owner.id].tags[m] + 'c');
                btn.parentNode.removeChild(btn);
            }
        }
        var father = self.c.nodes[owner.father];
        var index = father.children.indexOf(owner.id);
        father.children.splice(index, 1);


        if (!father.children.length) {
            if (father.id == "idea-original") {
                self.c.numNode = 0;
            }
            else {
                father.items.btnDelete.show();
                father.items.btnCollapse.hide();
                father.items.btnExpand.hide();
            }
        }

        //                }
        for (prop in self.c.connections)
            self.c.paper.connectionC(self.c.connections[prop]);


        self.c.paper.safari();

        for (var prop in owner.items) {
            owner.items[prop].remove();
        }
        delete self.c.nodes[owner.id];

    };

    node.deleteItems.deleteNodeBtn.click(function () {
        btnDeleteClick(node)
    })
    node.deleteItems.deleteBranchBtn.click(function () {
        var deleteNodes = {};

        deleteNodes[node.id] = {};
        deleteNodes[node.id].visites = 0;
        deleteNodes[node.id].children = node.children.length;


        var n = node.children[0];
        deleteNodes[n] = {};
        deleteNodes[n].visites = 0;
        deleteNodes[n].children = self.c.nodes[n].children.length;

        while (deleteNodes[node.id].visites < deleteNodes[node.id].children) {
            if (deleteNodes[n].visites == deleteNodes[n].children) {
                console.info(n);
                for (var prop in self.c.nodes[n].items) {
                    self.c.nodes[n].items[prop].remove();
                }

                self.c.connections[n].line.remove();
                self.c.connections[n].pd.remove();
                delete self.c.connections[n];

                for (var m = 0; m < self.c.nodes[n].tags.length; m++) {
                    self.c.tags[self.c.nodes[n].tags[m]].nodes.splice(self.c.tags[self.c.nodes[n].tags[m]].nodes.indexOf(n), 1);
                    if (!self.c.tags[self.c.nodes[n].tags[m]].nodes.length) {
                        delete self.c.tags[self.c.nodes[n].tags[m]];
                        var btn = document.getElementById(self.c.nodes[n].tags[m] + 'c');
                        btn.parentNode.removeChild(btn);
                    }
                }
                var idOld = n;
                n = self.c.nodes[n].father;
                deleteNodes[n].visites++;
                delete self.c.nodes[idOld];
            } else {
                n = self.c.nodes[n].children[deleteNodes[n].visites];
                deleteNodes[n] = {};
                deleteNodes[n].visites = 0;
                deleteNodes[n].children = self.c.nodes[n].children.length;
            }
        }
        btnDeleteClick(node);
        for (prop in self.c.connections)
            self.c.paper.connectionC(self.c.connections[prop]);
        self.c.paper.safari();
    })
    node.items.btnDelete.click(function () {
        if (node.children.length == 0) {
            node.deleteItems.deleteNodeBtn.show();
            node.deleteItems.deleteNodeBtn.toFront();
        } else {
            node.deleteItems.deleteBranchBtn.show();
            node.deleteItems.deleteBranchBtn.toFront();
        }

    });

    node.items.label.dblclick(function () {

        self.c.edit = 1;

        node.items.shape.attr({src: "resources/community/style/image/dsresearch/Blue_node1.png"});
        self.winEdit.title.value = node.items.label.attr("text");

        self.winEdit.description.value = node.description;
        if (node.statut == "enabled")
            self.winEdit.enabled.checked = true;
        else
            self.winEdit.disabled.checked = true;

        self.winEdit.tag.value = node.tags.toString();
        var navigo = document.getElementById('tagNavigo');

        self.winEdit.btnEnableBranche.onclick = function () {
            self.winEdit.enabled.checked = true;
            node.statut = "enabled";

            var enableNodes = {};

            enableNodes[node.id] = {};
            enableNodes[node.id].visites = 0;
            enableNodes[node.id].children = node.children.length;


            var n = node.children[0];
            enableNodes[n] = {};
            enableNodes[n].visites = 0;
            enableNodes[n].children = self.c.nodes[n].children.length;

            while (enableNodes[node.id].visites < enableNodes[node.id].children) {
                if (enableNodes[n].visites == enableNodes[n].children) {
                    self.c.nodes[n].statut = "enabled";
                    self.c.nodes[n].items.shape.attr({src: "resources/community/style/image/dsresearch/node-c.png"});
                    n = self.c.nodes[n].father;
                    enableNodes[n].visites++;
                } else {
                    n = self.c.nodes[n].children[enableNodes[n].visites];
                    enableNodes[n] = {};
                    enableNodes[n].visites = 0;
                    enableNodes[n].children = self.c.nodes[n].children.length;
                }
            }
        }
        self.winEdit.btnDisableBranche.onclick = function () {
            self.winEdit.disabled.checked = true;
            node.statut = "disabled";

            var enableNodes = {};

            enableNodes[node.id] = {};
            enableNodes[node.id].visites = 0;
            enableNodes[node.id].children = node.children.length;


            var n = node.children[0];
            enableNodes[n] = {};
            enableNodes[n].visites = 0;
            enableNodes[n].children = self.c.nodes[n].children.length;

            while (enableNodes[node.id].visites < enableNodes[node.id].children) {
                if (enableNodes[n].visites == enableNodes[n].children) {
                    self.c.nodes[n].statut = "disabled";
                    self.c.nodes[n].items.shape.attr({src: "resources/community/style/image/dsresearch/Blue_node3.png"});
                    n = self.c.nodes[n].father;
                    enableNodes[n].visites++;
                } else {
                    n = self.c.nodes[n].children[enableNodes[n].visites];
                    enableNodes[n] = {};
                    enableNodes[n].visites = 0;
                    enableNodes[n].children = self.c.nodes[n].children.length;
                }
            }
        }
        self.winEdit.btnOK.onclick = function () {
            self.c.edit = 0;
            self.winEdit.style.display = 'none';
            self.c.win.hide();
            node.statut = self.winEdit.enabled.checked ? "enabled" : "disabled";
            if (node.statut == "disabled")
                node.items.shape.attr({src: "resources/community/style/image/dsresearch/Blue_node3.png"});
            else
                node.items.shape.attr({src: "resources/community/style/image/dsresearch/node-c.png"});

            node.items.label.attr({
                text: self.wrapText(self.winEdit.title.value, 15)
            });
            node.title = self.winEdit.title.value;

            node.description = self.winEdit.description.value;




            var tags = self.winEdit.tag.value.split(',');
            /// delete the tags in navigo
            for (var i = 0; i < node.tags.length; i++) {
                if (tags.indexOf(node.tags[i]) == -1 && self.c.tags[node.tags[i]]) {
                    self.c.tags[node.tags[i]].nodes.splice(self.c.tags[node.tags[i]].nodes.indexOf(node.id), 1);
                    if (!self.c.tags[node.tags[i]].nodes.length) {
                        delete self.c.tags[node.tags[i]];
                        console.info(navigo.childNodes.toSource());
                        navigo.removeChild(document.getElementById(node.tags[i] + "c"));

                    }
                }
            }
            /// create the tags in navigo
            for (var i = 0; i < tags.length; i++) {
                if (tags[i] != "" && node.tags.indexOf(tags[i]) == -1) {

                    node.tags.push(tags[i]);

                    if (!self.c.tags[tags[i]]) {

                        self.c.tags[tags[i]] = {};
                        self.c.tags[tags[i]].nodes = [];
                        self.c.tags[tags[i]].click = 1;
                        var btn = document.createElement("input");
                        btn.setAttribute("type", "button");
                        btn.setAttribute("id", tags[i] + 'c');
                        btn.setAttribute("value", tags[i]);
                        btn.setAttribute("class", "btnClick1");
                        //  btn.setAttribute("disabled", true);

                        btn.onclick = function () {
                            tag = this.value;
                            self.findNodeC(tag);
                            if (self.winNavigoK.style.display == "block" && self.k.tags[tag])
                                self.findNodeK(tag);
                        }

                        navigo.appendChild(btn);

                    }
                    self.c.tags[tags[i]].nodes.push(node.id);



                }
            }
            node.tags = tags;
            node.items.tags.attr({text: "Tags:\n" + self.wrapText(node.tags.toString(), 15)});
        };
        self.winEdit.btnCancel.onclick = function () {
            self.c.edit = 0;
            self.c.win.hide();
            self.winEdit.style.display = 'none';
            if (node.statut == "disabled")
                node.items.shape.attr({src: "resources/community/style/image/dsresearch/Blue_node3.png"});
            else
                node.items.shape.attr({src: "resources/community/style/image/dsresearch/node-c.png"});
            //node.items.shape.attr({ src: "resources/community/style/image/dsresearch/node-c.png" });
        }


        self.winEdit.style.display = "block";
        self.c.win.show();


    });
//  if (!node.isExpand) btnCollapse();
//END---------------------------------------configure the actions of the components -------------------------------------------------//
    return node

}