
import Greeter from "./greet";

$(()=>{
  $('body').append(`<p>${new Greeter().greet()}</p>`);
});

export function xx() {
  return 123;
}
