console.log('This is sample1');

class Greeter {
    constructor(public greeting: string) { }
    greet() {

      // generate lint warnings
      // for (var i = 10; i >= 0; i++) {
      // }

      let square = (x:number)=>x*x;
      return `Hello, TypeScript! num=${square(2)}}`;
    }
}
