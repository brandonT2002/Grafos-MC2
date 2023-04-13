//Analizador Léxico}
%{
    //código javascript
    let errores = []
    let grafo = {}
    function iniciarEnlaces(nombreNodo) {
        if(!grafo.hasOwnProperty(nombreNodo)) {
            grafo[nombreNodo] = [];
        }
    }
    function pushEnlace(nodo1,nodo2) {
        iniciarEnlaces(nodo1);
        iniciarEnlaces(nodo2);
        if(!(grafo[nodo1].includes(nodo2))) {
            grafo[nodo1].push(nodo2);
        }
        if(!(grafo[nodo2].includes(nodo1))) {
            grafo[nodo2].push(nodo1);
        }
    }
%}
%lex
//%options case-insensitive

/*expresiones regulares*/

nodo        [a-zA-Z][a-zA-Z0-9]* //a, ab, a0

%%
\/\/.*                                  {}//comentario simple
\/\*[^*]*[*]+([^/*][^*]*[*]+)*\/        {}//comentario multilínea
\s+                                     {}
[ \n\t\r]                               {}
{nodo}                                  {return 'nodo'}
'->'                                    {return 'enlace'}
';'                                     {return 'pyc'}
.                                       {errores.push(yytext)}
<<EOF>>                                 {return 'EOF'}

/lex

//Analizador Sintáctico

%start INICIO

%%

INICIO: GRAFO EOF {return grafo;};

GRAFO: 
    GRAFO ENLACES |
    ENLACES;

ENLACES:
    LISTA_NODOS pyc |
    LISTA_NODOS;

//  a -> b -> c
LISTA_NODOS:
    LISTA_NODOS enlace nodo     {pushEnlace($1,$3);$$ = $3} |
    nodo                        {$$ = yytext;};