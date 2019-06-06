// Search API URL - https://www.food2fork.com/api/search
// API key bf329327176803459447269e4bb95237

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader} from './views/base';



/** Gloabal state of the app
 * - Search object
 * - Current recipe object 
 * - Shopping list object
 * - Like recipes
 */

const state = {}; 

/**
 * SEARCH CONTROLER 
 */

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); //TODO

    if (query) {
    // 2) New search object and add to state
    state.search = new Search(query); 
    // 3) Prepare UI for results 
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);


    try {
    // 4) Seach for recipes
   await state.search.getResults();
    // 5) Render results in UI
    clearLoader();
    searchView.renderResults(state.search.result);
    } catch (err) {
        alert('Somthing woring with the search...'); 
        clearLoader(); 
        }

    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); 
    controlSearch(); 
}); 


elements.searchResPages.addEventListener('click', e => {
const btn = e.target.closest('.btn-inline');
if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 * RECIPE CONTROLER 
 */


/* FOR API TESTING 
const  r = new Recipe(47746);
r.getRecipe(); 

console.log(r); 
*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '')
    console.log(id);

    if (id) {

        // Prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
        // Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        // Calculate servings and time 
        state.recipe.calcTime(); 
        state.recipe.calcServings();
        // Render recipe 
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe); 
// window.addEventListener('load', controlRecipe)

// or 

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 





