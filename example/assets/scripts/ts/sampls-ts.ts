class Greeter {
    constructor(public greeting: string) { }
    greet() { return "Hello, TypeScript!" }
}

console.log(new Greeter("").greet());
