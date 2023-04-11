var editor = CodeMirror(document.getElementById("editor"), {
    mode: "text/x-java",
    lineNumbers: true,
    styleActiveLine: true,
    theme: "midnight"
});

// let graphContainer = d3.select("#graph");

editor.on("change", function(cm) {
    let code = cm.getValue();
    // try {
    //     let graph = Viz(code);
    //     let parser = new DOMParser();
    //     let svg = parser.parseFromString(graph, "image/svg+xml").querySelector("svg");
    //     graphContainer.selectAll("*").remove();
    //     graphContainer.append(() => svg);
    // } catch (e) {
    //     // console.log(e);
    //     graphContainer.selectAll("*").remove();
    // }
    d3.select('#graph').graphviz().height(document.getElementById('editor').clientHeight).width(document.getElementById('editor').clientWidth).renderDot(
        `digraph G{
            rankdir=LR
            engine="circo"
            bgcolor="#01162600"
            node[shape=circle color="white" fontcolor="white"]
            edge[color="white" dir=none]
            ${code}
        }`
    )
});