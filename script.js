document.addEventListener('DOMContentLoaded', () => {

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
        for (const food in foodData) {
            const option = document.createElement('option');
            option.value = food;
            option.textContent = `${food}`;
            foodItemSelect.appendChild(option);
        }
    }

    // --- LOCAL STORAGE FUNCTIONS ---

    function saveDataToLocalStorage() {
        localStorage.setItem('healthTrackerMeals', JSON.stringify(savedMeals));
        localStorage.setItem('healthTrackerWater', JSON.stringify(waterData));
    }

    function loadDataFromLocalStorage() {
        const storedMeals = localStorage.getItem('healthTrackerMeals');
        const storedWater = localStorage.getItem('healthTrackerWater');

        if (storedMeals) {
            savedMeals = JSON.parse(storedMeals);
        }
        if (storedWater) {
            waterData = JSON.parse(storedWater);
        }
    }

    // --- RENDER FUNCTIONS ---

    function renderMeals() {
        mealList.innerHTML = '';
        let dailyTotalCalories = 0;
        savedMeals.forEach((meal, index) => {
            const li = createMealElement(meal, index);
            mealList.appendChild(li);
            dailyTotalCalories += meal.totalCalories;
        });
        totalCaloriesEl.textContent = dailyTotalCalories;
    }

    function renderCurrentMeal() {
        currentMealList.innerHTML = '';
        let mealTotal = 0;
        currentMealItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'text-sm flex justify-between items-center bg-gray-800 p-2 rounded';
            li.innerHTML = `
                <span>${item.name} (${item.quantity} ${item.unit}) - <span class="text-gray-400">${item.calories} kcal</span></span>
                <button class="remove-item-btn text-red-500 text-xs hover:text-red-400" data-index="${index}"><i class="fas fa-times-circle"></i></button>
            `;
            currentMealList.appendChild(li);
            mealTotal += item.calories;
        });
        currentMealTotalEl.textContent = `${mealTotal} kcal`;
    }

    function renderWaterTracker() {
        glassContainer.innerHTML = '';
        for (let i = 0; i < glassesToTrack; i++) {
            const glass = document.createElement('div');
            glass.className = 'glass';
            glass.dataset.index = i;
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
        let mealItemsHtml = meal.items.map(item => `<li class="text-sm text-gray-400">${item.name} (${item.quantity} ${item.unit}) - ${item.calories} kcal</li>`).join('');
        li.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h5 class="font-semibold text-white">${meal.name}</h5>
                    <ul class="mt-2 space-y-1">${mealItemsHtml}</ul>
                </div>
                <div class="text-right">
                   <p class="font-bold text-lg text-custom-green">${meal.totalCalories} kcal</p>
                   <button class="remove-meal-btn text-red-500 hover:text-red-400 transition-colors mt-2"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
        return li;
    }

    function resetCurrentMealForm() {
        currentMealItems = [];
        renderCurrentMeal();
        mealNameInput.value = '';
        foodItemSelect.value = '';
        foodQuantityInput.value = '';
        updateUnitDisplay();
    }
    
    function openModal() {
        loginModal.classList.remove('hidden');
        loginModal.classList.add('flex');
    }

    function closeModal() {
        loginModal.classList.add('hidden');
        loginModal.classList.remove('flex');
    }

    // --- EVENT LISTENERS SETUP ---

    function setupEventListeners() {
        // Modal Listeners
        getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
        getStartedBtnHero.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
        closeModalBtn.addEventListener('click', closeModal);
        loginModal.addEventListener('click', (e) => { if (e.target === loginModal) closeModal(); });
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Account created successfully! (Frontend Demonstration)');
            loginForm.reset();
            closeModal();
        });

        // Meal Tracker Listeners
        foodItemSelect.addEventListener('change', updateUnitDisplay);
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
            foodQuantityInput.value = '';
        });
        currentMealList.addEventListener('click', (e) => {
             if (e.target.closest('.remove-item-btn')) {
                const index = e.target.closest('.remove-item-btn').dataset.index;
                currentMealItems.splice(index, 1);
                renderCurrentMeal();
            }
        });
        saveMealBtn.addEventListener('click', () => {
            const mealName = mealNameInput.value.trim();
            if (!mealName || currentMealItems.length === 0) {
                alert('Please enter a meal name and add at least one food item.');
                return;
            }
            const mealTotalCalories = currentMealItems.reduce((sum, item) => sum + item.calories, 0);
            savedMeals.push({ name: mealName, items: currentMealItems, totalCalories: mealTotalCalories });
            renderMeals();
            saveDataToLocalStorage();
            resetCurrentMealForm();
        });
        mealList.addEventListener('click', (e) => {
            if (e.target.closest('.remove-meal-btn')) {
                const li = e.target.closest('li');
                const index = li.dataset.index;
                savedMeals.splice(index, 1);
                renderMeals();
                saveDataToLocalStorage();
            }
        });
        clearMealsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all meals for today?')) {
                savedMeals = [];
                renderMeals();
                saveDataToLocalStorage();
            }
        });

        // Water Tracker Listeners
        glassContainer.addEventListener('click', (e) => {
            const glass = e.target.closest('.glass');
            if (glass) {
                const index = parseInt(glass.dataset.index);
                waterData.filledGlasses = (waterData.filledGlasses === index + 1) ? index : index + 1;
                renderWaterTracker();
                saveDataToLocalStorage();
            }
        });
        clearWaterBtn.addEventListener('click', () => {
            waterData.filledGlasses = 0;
            renderWaterTracker();
            saveDataToLocalStorage();
        });
    }

    // --- RUN APP ---
    init();
});

