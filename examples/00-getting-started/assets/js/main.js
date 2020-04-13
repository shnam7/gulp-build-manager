// ES6 script

console.log("ES6/Babel example...");

let greetings = (msg) => {
    'use strict';
    console.log(`Hello ${msg}`);
};

greetings('ES6/Babel');

window.onload = () => {
    document.getElementById('point1').innerText = 'ES6/Babel is working!';
    setInterval(()=>{
        document.getElementById('point2').innerText = Date.now().toString();
    }, 1000)
}
