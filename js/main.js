import { add, multiply } from "./utils/math.js";
import { greet } from "./utils/strings.js";

const result  = add(2, 3);
const product = multiply(4, 5);
const message = greet("Nebula");

console.log(message);
console.log("add(2, 3) =", result);
console.log("multiply(4, 5) =", product);

document.getElementById("output").innerHTML =
  message + "<br>add(2, 3) = " + result + "<br>multiply(4, 5) = " + product;