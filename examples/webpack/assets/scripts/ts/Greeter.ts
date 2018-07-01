export default class Greeter {
    greet(): string {
      let square = (x:number)=>x*x;
      console.log('Greeter is called.');
      return `Hello, TypeScript! num=${square(1234567)}`;
    }
}
