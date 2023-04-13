let parser = require('./Parser')
grafo = parser.parse(`
a->b->c->d;
c->a;
`)

console.log(grafo)