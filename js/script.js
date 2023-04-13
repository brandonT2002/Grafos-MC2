var editor = CodeMirror(document.getElementById("editor"), {
    mode: "text/x-java",
    lineNumbers: true,
    styleActiveLine: true,
    theme: "midnight"
});
editor.on("change", function(cm) {
    try {
        let code = cm.getValue();
        d3.select('#graph').graphviz().height(600*.5).width(document.getElementById('editor').clientWidth).renderDot(
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
    if(grafo[vIni] != null && grafo[vFin] != null) {
        Object.entries(grafo).forEach(([vertice,enlaces]) => {
            console.log(`${vertice}: ${enlaces}`);
        });
        return;
    }
    swal({
        title: "¡Oops!",
        text: "Verifique los vertices",
        icon: "info"
    })
}
function limpiarCampos(){
    document.getElementById('vIni').value = ''
    document.getElementById('vFin').value = ''
}