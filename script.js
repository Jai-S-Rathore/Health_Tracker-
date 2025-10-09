document.addEventListener('DOMContentLoaded', () => {
    // Food data with estimated calories per unit
    const foodData = {
        "Roti/Chapati": { calories: 80, unit: "piece" },
        "Rice": { calories: 205, unit: "bowl" },
        "Dal (lentil curry)": { calories: 150, unit: "bowl" },
        "Mixed Vegetable Sabzi": { calories: 120, unit: "serving" },
        "Paneer Butter Masala": { calories: 350, unit: "serving" },
        "Chicken Curry": { calories: 300, unit: "serving" },
        "Idli": { calories: 60, unit: "piece" },
        "Dosa (plain)": { calories: 120, unit: "piece" },
        "Samosa": { calories: 262, unit: "piece" },
        "Curd/Yogurt": { calories: 90, unit: "bowl" },
        "Salad": { calories: 50, unit: "bowl" }
    };

    const foodItemSelect = document.getElementById('food-item');
    for (const food in foodData) {
        const option = document.createElement('option');
        option.value = food;
        option.textContent = `${food} (~${foodData[food].calories} kcal/${foodData[food].unit})`;
        foodItemSelect.appendChild(option);
    }

    const mealNameInput = document.getElementById('meal-name');
    const foodQuantityInput = document.getElementById('food-quantity');
    const addFoodItemBtn = document.getElementById('add-food-item-btn');
    const currentMealList = document.getElementById('current-meal-list');
    const currentMealTotalEl = document.getElementById('current-meal-total');
    const saveMealBtn = document.getElementById('save-meal-btn');
    const mealList = document.getElementById('meal-list');
    const totalCaloriesEl = document.getElementById('total-calories');
    
    let currentMealItems = [];
    let dailyTotalCalories = 0;

    addFoodItemBtn.addEventListener('click', () => {
        const selectedFood = foodItemSelect.value;
        const quantity = parseInt(foodQuantityInput.value);

        if (!selectedFood || isNaN(quantity) || quantity <= 0) {
            alert('Please select a food item and enter a valid quantity.');
            return;
        }

        const foodInfo = foodData[selectedFood];
        const calculatedCalories = foodInfo.calories * quantity;
        
        currentMealItems.push({ name: selectedFood, quantity, unit: foodInfo.unit, calories: calculatedCalories });
        renderCurrentMeal();

        // Clear inputs
        foodItemSelect.value = '';
        foodQuantityInput.value = '';
    });

    function renderCurrentMeal() {
        currentMealList.innerHTML = '';
        let mealTotal = 0;
        currentMealItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'text-sm flex justify-between items-center';
            li.innerHTML = `
                <span>${item.quantity} ${item.unit}(s) of ${item.name} - <span class="text-gray-400">${item.calories} kcal</span></span>
                <button class="remove-item-btn text-red-500 text-xs" data-index="${index}"><i class="fas fa-times-circle"></i></button>
            `;
            currentMealList.appendChild(li);
            mealTotal += item.calories;
        });
        currentMealTotalEl.textContent = `${mealTotal} kcal`;
    }
    
    currentMealList.addEventListener('click', (e) => {
         if (e.target.closest('.remove-item-btn')) {
            const index = e.target.closest('.remove-item-btn').dataset.index;
            currentMealItems.splice(index, 1);
            renderCurrentMeal();
        }
    });

    saveMealBtn.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();
        if (!mealName) {
            alert('Please enter a name for your meal (e.g., Breakfast).');
            return;
        }
        if (currentMealItems.length === 0) {
            alert('Please add at least one food item to the meal.');
            return;
        }

        const mealTotalCalories = currentMealItems.reduce((sum, item) => sum + item.calories, 0);

        // Create list item for the saved meal
        const li = document.createElement('li');
        li.className = 'bg-gray-700 p-4 rounded-lg animate-fade-in';
        li.dataset.calories = mealTotalCalories;
        
        let mealItemsHtml = currentMealItems.map(item => `<li class="text-sm text-gray-400">${item.quantity} ${item.unit}(s) ${item.name} - ${item.calories} kcal</li>`).join('');

        li.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h5 class="font-semibold text-white">${mealName}</h5>
                    <ul class="mt-2 space-y-1">${mealItemsHtml}</ul>
                </div>
                <div class="text-right">
                   <p class="font-bold text-lg text-custom-green">${mealTotalCalories} kcal</p>
                   <button class="remove-meal-btn text-red-500 hover:text-red-400 transition-colors mt-2"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        mealList.appendChild(li);

        // Update daily total
        dailyTotalCalories += mealTotalCalories;
        totalCaloriesEl.textContent = dailyTotalCalories;

        // Reset current meal
        currentMealItems = [];
        renderCurrentMeal();
        mealNameInput.value = '';
    });

    mealList.addEventListener('click', (e) => {
        if (e.target.closest('.remove-meal-btn')) {
            const li = e.target.closest('li');
            if (li) {
                const calories = parseInt(li.dataset.calories);
                
                // Update total calories
                dailyTotalCalories -= calories;
                totalCaloriesEl.textContent = dailyTotalCalories;

                // Remove item from list
                li.remove();
            }
        }
    });

    // --- LOGIN MODAL VARIABLES ---
// Get references to all the HTML elements needed
const getStartedBtn = document.getElementById('get-started-btn');
const getStartedBtnHero = document.getElementById('get-started-btn-hero');
const loginModal = document.getElementById('login-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const loginForm = document.getElementById('login-form');

// --- HELPER FUNCTIONS ---

// Function to make the modal visible
function openModal() {
    loginModal.classList.remove('hidden');
    loginModal.classList.add('flex');
}

// Function to hide the modal
function closeModal() {
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
}

// --- EVENT LISTENERS SETUP ---

// This function sets up all the interactive triggers
function setupEventListeners() {
    // Modal Listeners
    // Open the modal when "Get Started" buttons are clicked
    getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    getStartedBtnHero.addEventListener('click', (e) => { e.preventDefault(); openModal(); });

    // Close the modal when the '×' button is clicked
    closeModalBtn.addEventListener('click', closeModal);

    // Close the modal if the user clicks on the dark background
    loginModal.addEventListener('click', (e) => { 
        if (e.target === loginModal) {
            closeModal(); 
        }
    });
    
    // Handle the form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the page from reloading
        alert('Account created successfully! (Frontend Demonstration)');
        loginForm.reset(); // Clear the form fields
        closeModal(); // Close the modal
    });

    // ... other event listeners for the rest of the page
}

// The script finds and sets up these listeners when the page loads.
});
