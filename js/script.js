var editor = CodeMirror(document.getElementById("editor"), {
    mode: "text/x-java",
    lineNumbers: true,
    styleActiveLine: true,
    theme: "midnight"
});
editor.on("change", function(cm) {
    try {
        let code = cm.getValue();
        d3.select('#graph').graphviz().scale(1.75).height(600*.5).width(document.getElementById('editor').clientWidth).renderDot(
            `digraph G{
                rankdir=LR
                engine="circo"
                bgcolor="#01162600"
                node[shape=circle color="white" fontcolor="white"]
                edge[color="white" dir=none]
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
        // Object.entries(grafo).forEach(([vertice,enlaces]) => {
        //     console.log(`${vertice}: ${enlaces}`);
        // });

        // llamar a la función buscar caminos
        caminos = buscarCaminos(grafo,vIni,vFin);
        caminos.sort((a,b) => a.length - b.length)
        console.log(caminos)
        return;
    }
    swal({
        title: "¡Oops!",
        text: "Verifique los vertices",
        icon: "info"
    })
}
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