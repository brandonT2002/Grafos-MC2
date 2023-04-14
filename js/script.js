var editor = CodeMirror(document.getElementById("editor"), {
    mode: "text/x-java",
    lineNumbers: true,
    styleActiveLine: true,
    theme: "midnight"
});
editor.on("change", function(cm) {
    try {
        let code = cm.getValue();
        d3.select('#graph').graphviz().scale(1.69).height(600*.45).width(document.getElementById('editor').clientWidth).renderDot(
            `digraph G{
                rankdir=LR;
                bgcolor="#01162600";
                node[shape=circle color="white" fontcolor="white" style=filled fillcolor="#01162600"];
                edge[color="white" dir=none];
                ${code}
            }`
        )
    }
    catch(error) {}
});
function analizar(){
    let vIni = document.getElementById('vIni').value
    let vFin = document.getElementById('vFin').value
    if (vIni.replace(' ','') == '' || vFin.replace(' ','') == ''){
        swal({
            title: "¡Oops!",
            text: "Todos los campos son obligatorios",
            icon: "info"
        })
    }
    else {
        analizarGrafo(vIni,vFin,Parser.parse(editor.getValue()))
    }
}
function analizarGrafo(vIni,vFin,grafo) {
    console.log('NUEVO PARSEO')
    // console.log(grafo)
    if(grafo[vIni] != null && grafo[vFin] != null) {
        //Object.entries(grafo).forEach(([vertice,enlaces]) => {
        //    console.log(`${vertice}: ${enlaces}`);
        //});

        // llamar a la función buscar caminos
        caminos = buscarCaminos(grafo,vIni,vFin);
        if(caminos.length > 0) {
            caminos.sort((a,b) => a.length - b.length)
            verCaminos(caminos)
            return
        }
        return
    }
    swal({
        title: "¡Oops!",
        text: "Verifique los vertices",
        icon: "info"
    })
}
function verCaminos(caminos) {
    d3.select('#optimo').graphviz().scale(1).height(600*.75).width(800*.75).renderDot(
        `digraph G{
            rankdir=LR;
            labelloc=t;
            label="Camino óptimo" fontcolor="white";
            bgcolor="#01162600";
            node[shape=circle color="white" fontcolor="white" style=filled fillcolor="#01162600"];
            edge[color="white" dir=none];
            ${editor.getValue()}
            ${obtenerVisitadosGrafo(caminos,0)}
        }`
    )
    if(caminos.length > 1) {
        d3.select('#camino1').graphviz().scale(1).height(600*.75).width(800*.75).renderDot(
            `digraph G{
                rankdir=LR;
                labelloc=t;
                label="Camino 1" fontcolor="white";
                bgcolor="#01162600";
                node[shape=circle color="white" fontcolor="white" style=filled fillcolor="#01162600"];
                edge[color="white" dir=none];
                ${editor.getValue()}
                ${obtenerVisitadosGrafo(caminos,1)}
            }`
        )
        if(caminos.length > 2) {
            d3.select('#camino2').graphviz().scale(1).height(600*.75).width(800*.75).renderDot(
                `digraph G{
                    rankdir=LR;
                    labelloc=t;
                    label="Camino 2" fontcolor="white";
                    bgcolor="#01162600";
                    node[shape=circle color="white" fontcolor="white" style=filled fillcolor="#01162600"];
                    edge[color="white" dir=none];
                    ${editor.getValue()}
                    ${obtenerVisitadosGrafo(caminos,2)}
                }`
            )
        }
    }
    else{
        d3.select("#camino1").selectAll("*").remove();
        d3.select("#camino2").selectAll("*").remove();
    }
}
function obtenerVisitadosGrafo(caminos,numero) {
    visitados = ''
    for(let i = 0; i < caminos[numero].length; i ++) {
        if(i == 0) {
            visitados += `${caminos[numero][i]}[label="${caminos[numero][i]}\\n(${i + 1})" fontsize="10" fillcolor="#F7C04A" peripheries=2];`
        }
        else if(i == caminos[numero].length - 1) {
            visitados += `\n${caminos[numero][i]}[label="${caminos[numero][i]}\\n(${i + 1})" fontsize="10" fillcolor="#539165" peripheries=2];`
        }
        else {
            visitados += `\n${caminos[numero][i]}[label="${caminos[numero][i]}\\n(${i + 1})" fontsize="10" peripheries=2];`
        }
    }
    return visitados
}
/*
a->b;
//a->c;
a->d;
//a->e;

b->c;
d->e;

b->e;
d->c;
*/
function buscarCaminos(grafo,vIni,vFin,visitados = []){
    let caminos = [];
    visitados.push(vIni);

    if (vIni === vFin){
        return [visitados]
    }
    if (!grafo[vIni]){
        return [];
    }
    
    for (let vecino of grafo[vIni]){
        if (!visitados.includes(vecino)){
            let subCaminos = buscarCaminos(grafo, vecino, vFin, visitados.slice())
            for (let subCamino of subCaminos){
                caminos.push(subCamino);
            }
        }
    }
    return caminos;
}
function limpiarCampos(){
    document.getElementById('vIni').value = ''
    document.getElementById('vFin').value = ''
}