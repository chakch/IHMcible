/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var graph = {};
window.onload = function () {

    graph.canvas = Raphael("holder", 1300, 480),
            graph.nodes = [];
    graph.mouseoverEL = null;
    graph.oldX = 10;
    graph.oldY = 10;

    /*graph.nodes.push(graph.canvas.concept(190, 100, 0, "racine"));
     
     for (i = 1; i < 5; i++) {
     graph.nodes.push(graph.canvas.concept(190 + i * 50, 100 + i * 20, i, 'Métier'));
     }*/
    createNode = function () {
        var name = prompt("Please enter type of concept (Metier, Competence, Diplome, Ecole, TypeEcole, SousSecteur, Entreprise) : ", "Metier");
        if (name !== "") {
            graph.nodes.push(graph.canvas.concept(190, 100, graph.nodes.length, name));
        }
    };
    submit = function () {
        console.info(graph.nodes[0]);
        var name = confirm("Lancer la requête ?");
        if (name &&graph.nodes.length) {
             var class1 = "";
            var instance1 = "";
            var class2="";
            var instance2="";
            
            var url="";
            
            if(graph.nodes.length===2){
                 for (var i = 0; i < graph.nodes.length; i++){
                     if(graph.nodes[i].isConcept) class1=graph.nodes[i].title;
                     else instance1=graph.nodes[i].title;
                 }
                 
                url="http://23.97.213.185:8080/projetkm/"+class1+"/"+instance1;
                
            }else if(graph.nodes.length===3){
                for (var i = 0; i < graph.nodes.length; i++){
                     if(graph.nodes[i].isConcept) class1=graph.nodes[i].title;
                     else if(!instance1) instance1=graph.nodes[i].title;
                     else instance2=graph.nodes[i].title;
                 }
                 url="http://23.97.213.185:8080/projetkm/"+instance1+"/"+class1+"/"+instance2;
                 
            }else if (graph.nodes.length===4){
                for (var i = 0; i < graph.nodes.length; i++){
                    //console.info(graph.nodes[i].title+":"+graph.nodes[i].title)
                     if(graph.nodes[i].isConcept &&Object.keys(graph.nodes[i].connections).length===3) class1=graph.nodes[i].typeConcept;
                     else if (graph.nodes[i].isConcept) class2=graph.nodes[i].typeConcept;
                     else if(!instance1) instance1=graph.nodes[i].title;
                     else instance2=graph.nodes[i].title;
                 }
                 url="http://23.97.213.185:8080/projetkm/"+instance1+"/"+class1+"/"+instance2+"/?C="+class2;
            }
            else return "Dans la base de connaissance, il n'existe pas de graphe correspondant !"
       
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url, false);
            xmlHttp.send();
           // document.getElementById("docResult").innerHTML = xmlHttp.responseText;
            var myArr = JSON.parse(xmlHttp.responseText);
            for (i = 0; i < myArr.data.length; i++) {
                if (!document.getElementById(myArr.data[i])) {
                    document.getElementById("docResult").innerHTML+= "<h4>"+myArr.data[i]+"<h3>";
                    console.log(myArr.data[i]);

                }
            }

            // http://23.97.213.185:8080/projetkm/Competence/consultant%20en%20SI
//http://23.97.213.185:8080/projetkm/consultant%20en%20SI/SousSecteur/PepsiCo
//http://23.97.213.185:8080/projetkm/consultant%20en%20SI/SousSecteur/PepsiCo?C=Metier
        }else alert("Merci de saisir le graphe!");
    };



};

