console.log('This is sample1');

class Greeter {
    constructor(public greeting: string) { }
    greet() {
      let square = (x:number)=>x*x;
      return `Hello, TypeScript! num=${square(2)}}`;
    }
}
