import Greeter from "./greet";

const greeter = new Greeter();
console.log('Greeter loaded:', greeter.greet());

$(()=>{
  $('body').append(`<p>${greeter.greet()}</p>`);
});

export function xx() {
  return 123;
}