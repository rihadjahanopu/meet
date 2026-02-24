console.log("Hello, World!");

const a = 10;
const b = 20;

const total = a + b;

const add = (a, b) => a + b;

// higher order function
const addTwo = add.bind(null, 2);

addTwo(3);

// higher order function
const addThree = add.bind(null, 3);

addThree(4);

const date = new Date();
const dateLocal = date.toLocaleString();
console.log(dateLocal);
