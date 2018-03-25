console.log('This is sample1');

export class Greeter {
    constructor(public greeting: string) { }
    greet() {
      let square = (x:number)=>x*x;
      return `Hello, TypeScript! num=${square(2)}}`;
    }
}