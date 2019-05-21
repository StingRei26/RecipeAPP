// Search API URL - https://www.food2fork.com/api/search
// API key bf329327176803459447269e4bb95237

import Search from './models/Search';

const pizza = new Search('pizza'); 
const nachos = new Search('nachos'); 

console.log(pizza); 
pizza.getResults(); 
console.log(nachos); 
nachos.getResults(); 



