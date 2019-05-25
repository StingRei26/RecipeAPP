// Search API URL - https://www.food2fork.com/api/search
// API key bf329327176803459447269e4bb95237

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/** Gloabal state of the app
 * - Search object
 * - Current recipe object 
 * - Shopping list object
 * - Like recipes
 */

const state = {}; 

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); //TODO

    if (query) {
    // 2) New search object and add to state
    state.search = new Search(query); 
    // 3) Prepare UI for results 

    // 4) Seach for recipes
   await state.search.getResults();
    // 5) Render results in UI
    searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); 
    controlSearch(); 
}); 
 






