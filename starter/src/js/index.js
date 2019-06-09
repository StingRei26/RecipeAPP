// Search API URL - https://www.food2fork.com/api/search
// API key bf329327176803459447269e4bb95237

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader} from './views/base';


/** Gloabal state of the app
 * - Search object
 * - Current recipe object 
 * - Shopping list object
 * - Like recipes
 */

const state = {}; 
window.state = state;

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
    
    console.log(state.recipe);

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

        //Prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected rearch item 
        if (state.search) searchView.highlightSelect(id);
    
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
           // console.log(state.recipe); 
        }
    }
};

// window.addEventListener('hashchange', controlRecipe); 
// window.addEventListener('load', controlRecipe)

// or 

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 


/**
 * LIST CONTROLER 
 */


const controlList = () => {
    //Create a new list IF there is none yet
    if (!state.list) state.list = new List(); 

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item); 
    });
}


// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id); 

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// Handling recipe button clicks 

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked 
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc'); 
        recipeView.updateServingsIngredients(state.recipe);
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList(); 
    }
});


window.l = new List(); 

