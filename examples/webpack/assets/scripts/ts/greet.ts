export default class Greeter {
    constructor() { }
    greet() {
      let square = (x:number)=>x*x;
      return `Hello, TypeScript! num=${square(2)}`;
    }
}
