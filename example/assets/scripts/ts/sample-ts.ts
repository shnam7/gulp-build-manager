class Greeter {
    constructor(public greeting: string) { }
    greet() {
      let square = (x:number)=>x*x;
      return `Hello, TypeScript! num=${square(2)}}`;
    }
}

console.log(new Greeter("").greet());
