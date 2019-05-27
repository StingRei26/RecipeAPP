import axios from 'axios'; 

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = "bf329327176803459447269e4bb95237"; 
        try {
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`); 
       this.result = res.data.recipes; 
       // console.log(this.recipes); 
        } catch (error) {
        alert(error); 
        }
    }

}

             