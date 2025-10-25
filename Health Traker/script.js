// --- DATA ---
const foodData = {
    "Roti/Chapati": { calories: 80, unit: "piece" },
    "Rice": { calories: 205, unit: "bowl" },
    "Dal (lentil curry)": { calories: 150, unit: "bowl" },
    "Mixed Vegetable Sabzi": { calories: 120, unit: "bowl" },
    "Paneer Butter Masala": { calories: 350, unit: "bowl" },
    "Chicken Curry": { calories: 300, unit: "bowl" },
    "Idli": { calories: 60, unit: "piece" },
    "Dosa (plain)": { calories: 130, unit: "piece" },
    "Samosa": { calories: 260, unit: "piece" },
    "Curd/Yogurt": { calories: 100, unit: "bowl" },
    "Salad": { calories: 50, unit: "bowl" }
};

// --- MEAL TRACKER VARIABLES ---
const mealNameInput = document.getElementById('meal-name');
const foodItemSelect = document.getElementById('food-item');
const foodQuantityInput = document.getElementById('food-quantity');
const unitDisplay = document.getElementById('unit-display');
const addFoodItemBtn = document.getElementById('add-food-item-btn');
const currentMealList = document.getElementById('current-meal-list');
const currentMealTotalEl = document.getElementById('current-meal-total');
const saveMealBtn = document.getElementById('save-meal-btn');
const mealList = document.getElementById('meal-list');
const totalCaloriesEl = document.getElementById('total-calories');
const clearMealsBtn = document.getElementById('clear-meals-btn');

// Export / Import buttons (optional - add to your HTML if you want these)
const exportBtn = document.getElementById('export-data-btn');
const importInput = document.getElementById('import-data-input');

let currentMealItems = [];
let savedMeals = [];

// --- WATER TRACKER VARIABLES ---
const glassContainer = document.getElementById('glass-container');
const totalWaterEl = document.getElementById('total-water');
const clearWaterBtn = document.getElementById('clear-water-btn');
const glassesToTrack = 12;
const mlPerGlass = 250;
let waterData = { filledGlasses: 0 };

// --- LOGIN MODAL VARIABLES ---
const getStartedBtn = document.getElementById('get-started-btn');
const getStartedBtnHero = document.getElementById('get-started-btn-hero');
const loginModal = document.getElementById('login-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const loginForm = document.getElementById('login-form');

// --- INITIALIZATION ---
function init() {
    populateFoodDropdown();
    loadDataFromLocalStorage();
    renderMeals();
    renderWaterTracker();
    updateUnitDisplay();
    setupEventListeners();
}

function populateFoodDropdown() {
    if (!foodItemSelect) return;
    foodItemSelect.innerHTML = '<option value="">Select food</option>';
    for (const food in foodData) {
        const option = document.createElement('option');
        option.value = food;
        option.textContent = `${food}`;
        foodItemSelect.appendChild(option);
    }
}

// --- LOCAL STORAGE FUNCTIONS ---
function saveDataToLocalStorage() {
    try {
        localStorage.setItem('healthTrackerMeals', JSON.stringify(savedMeals));
        localStorage.setItem('healthTrackerWater', JSON.stringify(waterData));
    } catch (e) {
        console.warn('Failed to save to localStorage', e);
    }
}

function loadDataFromLocalStorage() {
    try {
        const storedMeals = localStorage.getItem('healthTrackerMeals');
        const storedWater = localStorage.getItem('healthTrackerWater');
        if (storedMeals) savedMeals = JSON.parse(storedMeals);
        if (storedWater) waterData = JSON.parse(storedWater);
    } catch (e) {
        console.warn('Failed to load from localStorage', e);
    }
}

// --- RENDER FUNCTIONS ---
function renderMeals() {
    if (!mealList || !totalCaloriesEl) return;
    mealList.innerHTML = '';
    let dailyTotalCalories = 0;
    savedMeals.forEach((meal, index) => {
        const li = createMealElement(meal, index);
        mealList.appendChild(li);
        dailyTotalCalories += meal.totalCalories || 0;
    });
    totalCaloriesEl.textContent = dailyTotalCalories;
}

function renderCurrentMeal() {
    if (!currentMealList || !currentMealTotalEl) return;
    currentMealList.innerHTML = '';
    let mealTotal = 0;
    currentMealItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'text-sm flex justify-between items-center bg-gray-800 p-2 rounded';
        li.innerHTML = `
            <span>${item.name} (${item.quantity} ${item.unit}) - <span class="text-gray-400">${item.calories} kcal</span></span>
            <div>
              <button class="edit-item-btn text-yellow-400 text-xs mr-2" data-index="${index}" title="Edit item">Edit</button>
              <button class="remove-item-btn text-red-500 text-xs hover:text-red-400" data-index="${index}" title="Remove item">Remove</button>
            </div>
        `;
        currentMealList.appendChild(li);
        mealTotal += item.calories;
    });
    currentMealTotalEl.textContent = `${mealTotal} kcal`;
}

function renderWaterTracker() {
    if (!glassContainer || !totalWaterEl) return;
    glassContainer.innerHTML = '';
    for (let i = 0; i < glassesToTrack; i++) {
        const glass = document.createElement('div');
        glass.className = 'glass';
        glass.dataset.index = i;
        glass.setAttribute('role', 'button');
        glass.setAttribute('aria-label', `Glass ${i + 1}`);
        glass.tabIndex = 0;
        glass.innerHTML = '<i class="fas fa-glass-whiskey"></i>';
        if (i < waterData.filledGlasses) {
            glass.classList.add('filled');
        }
        glassContainer.appendChild(glass);
    }
    totalWaterEl.textContent = `${waterData.filledGlasses * mlPerGlass} ml`;
}

// --- HELPER FUNCTIONS ---
function updateUnitDisplay() {
    if (!unitDisplay || !foodItemSelect) return;
    const selectedFood = foodItemSelect.value;
    if (selectedFood && foodData[selectedFood]) {
        unitDisplay.textContent = foodData[selectedFood].unit;
    } else {
        unitDisplay.textContent = "Unit";
    }
}

function createMealElement(meal, index) {
    const li = document.createElement('li');
    li.className = 'bg-gray-700 p-4 rounded-lg animate-fade-in';
    li.dataset.index = index;
    let mealItemsHtml = (meal.items || []).map(item => `<li class="text-sm text-gray-400">${item.name} (${item.quantity} ${item.unit}) - ${item.calories} kcal</li>`).join('');
    li.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h5 class="font-semibold text-white">${meal.name}</h5>
                <ul class="mt-2 space-y-1">${mealItemsHtml}</ul>
            </div>
            <div class="text-right">
               <p class="font-bold text-lg text-custom-green">${meal.totalCalories} kcal</p>
               <div class="mt-2">
                 <button class="edit-meal-btn text-yellow-400 hover:text-yellow-300 mr-2" title="Edit meal"><i class="fas fa-edit"></i></button>
                 <button class="remove-meal-btn text-red-500 hover:text-red-400" title="Delete meal"><i class="fas fa-trash"></i></button>
               </div>
            </div>
        </div>`;
    return li;
}

function resetCurrentMealForm() {
    currentMealItems = [];
    renderCurrentMeal();
    if (mealNameInput) mealNameInput.value = '';
    if (foodItemSelect) foodItemSelect.value = '';
    if (foodQuantityInput) foodQuantityInput.value = '';
    updateUnitDisplay();
}

function openModal() {
    if (!loginModal) return;
    loginModal.classList.remove('hidden');
    loginModal.classList.add('flex');
}

function closeModal() {
    if (!loginModal) return;
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
}

// --- EVENT LISTENERS SETUP ---
function setupEventListeners() {
    // Modal Listeners
    if (getStartedBtn) getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (getStartedBtnHero) getStartedBtnHero.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target === loginModal) closeModal(); });
    if (loginForm) loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Account created successfully! (Frontend Demonstration)');
        loginForm.reset();
        closeModal();
    });

    // Meal Tracker Listeners
    if (foodItemSelect) foodItemSelect.addEventListener('change', updateUnitDisplay);
    if (addFoodItemBtn) addFoodItemBtn.addEventListener('click', addFoodItemFromInputs);

    // allow pressing Enter in the quantity input to add item
    if (foodQuantityInput) {
        foodQuantityInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addFoodItemFromInputs();
            }
        });
    }

    if (currentMealList) currentMealList.addEventListener('click', (e) => {
         if (e.target.closest('.remove-item-btn')) {
            const index = parseInt(e.target.closest('.remove-item-btn').dataset.index, 10);
            if (!isNaN(index)) {
                currentMealItems.splice(index, 1);
                renderCurrentMeal();
            }
        } else if (e.target.closest('.edit-item-btn')) {
            const index = parseInt(e.target.closest('.edit-item-btn').dataset.index, 10);
            if (!isNaN(index)) editCurrentMealItem(index);
        }
    });

    if (saveMealBtn) saveMealBtn.addEventListener('click', () => {
        const mealName = mealNameInput ? mealNameInput.value.trim() : '';
        if (!mealName || currentMealItems.length === 0) {
            alert('Please enter a meal name and add at least one food item.');
            return;
        }
        const mealTotalCalories = currentMealItems.reduce((sum, item) => sum + (item.calories || 0), 0);
        savedMeals.push({ name: mealName, items: currentMealItems.slice(), totalCalories: mealTotalCalories });
        renderMeals();
        saveDataToLocalStorage();
        resetCurrentMealForm();
    });

    if (mealList) mealList.addEventListener('click', (e) => {
        if (e.target.closest('.remove-meal-btn')) {
            const li = e.target.closest('li');
            const index = li ? parseInt(li.dataset.index, 10) : NaN;
            if (!isNaN(index)) {
                if (confirm('Delete this meal?')) {
                    savedMeals.splice(index, 1);
                    renderMeals();
                    saveDataToLocalStorage();
                }
            }
        } else if (e.target.closest('.edit-meal-btn')) {
            const li = e.target.closest('li');
            const index = li ? parseInt(li.dataset.index, 10) : NaN;
            if (!isNaN(index)) {
                // move selected meal back to current form for editing
                const meal = savedMeals[index];
                if (meal) {
                    savedMeals.splice(index, 1);
                    currentMealItems = meal.items.map(i => ({ ...i }));
                    if (mealNameInput) mealNameInput.value = meal.name;
                    renderCurrentMeal();
                    renderMeals();
                    saveDataToLocalStorage();
                }
            }
        }
    });

    if (clearMealsBtn) clearMealsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all meals for today?')) {
            savedMeals = [];
            renderMeals();
            saveDataToLocalStorage();
        }
    });

    // Water Tracker Listeners
    if (glassContainer) {
        glassContainer.addEventListener('click', (e) => {
            const glass = e.target.closest('.glass');
            if (glass) {
                const index = parseInt(glass.dataset.index, 10);
                if (!isNaN(index)) {
                    // clicking a glass sets filled up to that glass; clicking the last filled glass reduces it by one
                    if (waterData.filledGlasses === index + 1) {
                        waterData.filledGlasses = index;
                    } else {
                        waterData.filledGlasses = index + 1;
                    }
                    renderWaterTracker();
                    saveDataToLocalStorage();
                }
            }
        });

        // keyboard support for glasses (space/enter)
        glassContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const glass = e.target.closest('.glass');
                if (glass) {
                    e.preventDefault();
                    glass.click();
                }
            }
        });
    }

    if (clearWaterBtn) clearWaterBtn.addEventListener('click', () => {
        waterData.filledGlasses = 0;
        renderWaterTracker();
        saveDataToLocalStorage();
    });

    // Export / Import (optional)
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = { meals: savedMeals, water: waterData };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `health-tracker-backup-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    }
    if (importInput) {
        importInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = JSON.parse(reader.result);
                    if (parsed && Array.isArray(parsed.meals)) savedMeals = parsed.meals;
                    if (parsed && parsed.water) waterData = parsed.water;
                    renderMeals();
                    renderWaterTracker();
                    saveDataToLocalStorage();
                    alert('Data imported successfully.');
                } catch (err) {
                    alert('Failed to import data: invalid file.');
                }
            };
            reader.readAsText(file);
            // reset input so same file can be re-imported if needed
            importInput.value = '';
        });
    }
}

// --- SMALL HELPERS ---
function addFoodItemFromInputs() {
    if (!foodItemSelect || !foodQuantityInput) return;
    const selectedFood = foodItemSelect.value;
    const quantity = parseInt(foodQuantityInput.value, 10);
    if (!selectedFood || isNaN(quantity) || quantity <= 0) {
        alert('Please select a food item and enter a valid quantity.');
        return;
    }
    const foodInfo = foodData[selectedFood];
    const calculatedCalories = (foodInfo.calories || 0) * quantity;
    currentMealItems.push({ name: selectedFood, quantity, unit: foodInfo.unit, calories: calculatedCalories });
    renderCurrentMeal();
    foodQuantityInput.value = '';
    // focus quantity for quick repeated entry
    foodQuantityInput.focus();
}

function editCurrentMealItem(index) {
    const item = currentMealItems[index];
    if (!item) return;
    // populate inputs with the selected item; remove it from the current items
    if (foodItemSelect) foodItemSelect.value = item.name;
    if (foodQuantityInput) foodQuantityInput.value = item.quantity;
    updateUnitDisplay();
    // remove the item so when user clicks add it will replace
    currentMealItems.splice(index, 1);
    renderCurrentMeal();
    // focus quantity for quicker edits
    if (foodQuantityInput) foodQuantityInput.focus();
}

// --- RUN APP ---
init();
