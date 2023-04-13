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
    /*let vIni = document.getElementById('vIni').value
    let vFin = document.getElementById('vFin').value
    if (vIni.replace(' ','') == '' || vFin.replace(' ','') == ''){
        swal({
            title: "¡Oops!",
            text: "Todos los campos son obligatorios",
            icon: "info",
            buttons: false,
            timer: 2000
        })
    }
    else {*/
        let parser = Parser
        analizarGrafo(parser.parse(editor.getValue()))
    //}
}
function analizarGrafo(grafo) {
    Object.entries(grafo).forEach(([vertice,enlaces]) => {
        console.log(`${vertice}: ${enlaces}`);
    });
}
function limpiarCampos(){
    document.getElementById('vIni').value = ''
    document.getElementById('vFin').value = ''
}