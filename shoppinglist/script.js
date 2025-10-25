document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const homeScreen = document.getElementById('home-screen');
    const listScreen = document.getElementById('list-screen');
    const weekBoxes = document.querySelectorAll('.week-box');
    const backBtn = document.getElementById('back-btn');
    const listTitle = document.getElementById('list-title');
    const shoppingList = document.getElementById('shopping-list');
    const editBtn = document.getElementById('edit-btn');
    const addItemForm = document.getElementById('add-item-form');
    const newItemInput = document.getElementById('new-item-input');
    const addItemBtn = document.getElementById('add-item-btn');

    // --- App State ---
    let currentWeek = null;
    let isEditMode = false;
    let draggedItem = null;
    let lists;

    // --- Data Persistence Functions ---
    const saveLists = () => {
        localStorage.setItem('shoppingLists', JSON.stringify(lists));
    };

    const loadLists = () => {
        const savedLists = localStorage.getItem('shoppingLists');
        if (savedLists) {
            lists = JSON.parse(savedLists);
        } else {
            // Default lists for first-time users
            lists = {
                1: [
                    { text: 'Cereal', checked: false },
                    { text: 'Sandwich chicken meat', checked: false },
                    { text: 'Bread', checked: false },
                    { text: 'Beans', checked: false },
                    { text: 'Soup', checked: false },
                    { text: 'Eggs * 6', checked: false },
                    { text: 'Chicken breasts', checked: false },
                    { text: 'Minced beef', checked: false },
                    { text: 'Susages', checked: false },
                    { text: 'Tunna', checked: false },
                    { text: 'Cuscous', checked: false },
                    { text: 'Potatos', checked: false },
                    { text: 'cucumber', checked: false },
                    { text: 'Cheese', checked: false },
                    { text: 'Milk', checked: false },
                    { text: 'Spring onions', checked: false },
                    { text: 'tortillas', checked: false },
                    { text: 'Sweet corn', checked: false },
                    { text: 'Hot dog rolls', checked: false },
                    { text: 'Onion chunty', checked: false },
                    { text: 'Gravy', checked: false },
                    { text: 'fruit', checked: false },
                    { text: 'Crips', checked: false },
                    { text: 'Cakes', checked: false },
                    { text: 'Chicken stock', checked: false },
                    
                ],
                2: [
                    { text: 'Cereal', checked: false },
                    { text: 'Sandwich chicken meat', checked: false },
                    { text: 'Bread', checked: false },
                    { text: 'Beans', checked: false },
                    { text: 'Soup', checked: false },
                    { text: 'Eggs * 6', checked: false },
                    { text: 'Chicken breasts', checked: false },
                    { text: 'Minced beef', checked: false },
                    { text: 'Bacon', checked: false },
                    { text: 'Tunna', checked: false },
                    { text: 'Cuscous', checked: false },
                    { text: 'Natchos', checked: false },
                    { text: 'Potatos', checked: false },
                    { text: 'Cucumber', checked: false },
                    { text: 'Cheese', checked: false },
                    { text: 'Milk', checked: false },
                    { text: 'Onions', checked: false },
                    { text: 'Sweet corn', checked: false },
                    { text: 'Burgur buns', checked: false },
                    { text: 'Onion chunty', checked: false },
                    { text: 'Gravy', checked: false },
                    { text: 'fruit', checked: false },
                    { text: 'Crips', checked: false },
                    { text: 'Cakes', checked: false },
                    { text: 'Chicken stock', checked: false },
                    
                ]
            };
            saveLists();
        }
    };

    // --- Screen Navigation ---
    const showListScreen = (week) => {
        currentWeek = week;
        listTitle.textContent = `Week ${week}`;
        homeScreen.classList.remove('active');
        listScreen.classList.add('active');
        renderList();
    };

    const showHomeScreen = () => {
        listScreen.classList.remove('active');
        homeScreen.classList.add('active');
        isEditMode = false;
        updateEditMode();
    };

    // --- List Rendering and Management ---
    const renderList = () => {
        shoppingList.innerHTML = '';
        if (!lists[currentWeek]) return;

        lists[currentWeek].forEach((item, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            if (item.checked) li.classList.add('checked');

            const checkbox = document.createElement('div');
            checkbox.classList.add('checkbox');
            if (item.checked) checkbox.classList.add('checked');
            checkbox.addEventListener('click', () => toggleChecked(index));

            const itemName = document.createElement('span');
            itemName.classList.add('item-name');
            itemName.textContent = item.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', () => removeItem(index));

            li.appendChild(checkbox);
            li.appendChild(itemName);
            li.appendChild(deleteBtn);
            shoppingList.appendChild(li);
        });
        updateEditMode();
    };

    const toggleChecked = (index) => {
        if (!isEditMode) {
            lists[currentWeek][index].checked = !lists[currentWeek][index].checked;
            saveLists();
            renderList();
        }
    };

    const removeItem = (index) => {
        lists[currentWeek].splice(index, 1);
        saveLists();
        renderList();
    };

    const addItem = () => {
        const newItemText = newItemInput.value.trim();
        if (newItemText) {
            lists[currentWeek].push({ text: newItemText, checked: false });
            saveLists();
            newItemInput.value = '';
            renderList();
            shoppingList.scrollTop = shoppingList.scrollHeight; // Auto-scroll to new item
        }
    };

    // --- Edit Mode ---
    const toggleEditMode = () => {
        isEditMode = !isEditMode;
        updateEditMode();
    };

    const updateEditMode = () => {
        const listItems = shoppingList.querySelectorAll('li');
        if (isEditMode) {
            editBtn.textContent = 'Done';
            addItemForm.classList.remove('hidden');
            document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'inline-block');
            listItems.forEach(item => {
                item.draggable = true;
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragend', handleDragEnd);
            });
            shoppingList.addEventListener('dragover', handleDragOver);
        } else {
            editBtn.textContent = 'Edit';
            addItemForm.classList.add('hidden');
            document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'none');
            listItems.forEach(item => {
                item.draggable = false;
                item.removeEventListener('dragstart', handleDragStart);
                item.removeEventListener('dragend', handleDragEnd);
            });
            shoppingList.removeEventListener('dragover', handleDragOver);
        }
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e) => {
        draggedItem = e.target;
        setTimeout(() => e.target.classList.add('draggable'), 0);
    };

    const handleDragEnd = () => {
        draggedItem.classList.remove('draggable');
        const updatedList = [];
        shoppingList.querySelectorAll('li').forEach(li => {
            const originalIndex = parseInt(li.dataset.index, 10);
            const item = lists[currentWeek].find((_, i) => i === originalIndex);
            if (item) {
                 const updatedItem = lists[currentWeek][originalIndex];
                 updatedList.push(updatedItem);
            }
        });

        const newOrderedList = [];
        const currentLis = shoppingList.querySelectorAll('li');
        currentLis.forEach(li => {
            const originalIndex = parseInt(li.dataset.index, 10);
            newOrderedList.push(lists[currentWeek][originalIndex]);
        });

        // This part is tricky. Re-build based on DOM order.
        const domOrderIndices = Array.from(shoppingList.querySelectorAll('li')).map(li => parseInt(li.dataset.index, 10));
        const reorderedList = domOrderIndices.map(index => lists[currentWeek][index]);

        const finalReorderedList = [];
        const currentItemsOnScreen = Array.from(shoppingList.querySelectorAll('li'));
        const originalList = lists[currentWeek];
        for(let i=0; i < currentItemsOnScreen.length; i++) {
            const domIndex = parseInt(currentItemsOnScreen[i].dataset.index, 10);
            finalReorderedList.push(originalList[domIndex]);
        }
        lists[currentWeek] = finalReorderedList;
        saveLists();
        renderList();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(shoppingList, e.clientY);
        if (afterElement == null) {
            shoppingList.appendChild(draggedItem);
        } else {
            shoppingList.insertBefore(draggedItem, afterElement);
        }
    };

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('li:not(.draggable)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };
    
    // --- Initial Setup and Event Listeners ---
    const init = () => {
        loadLists();
        
        weekBoxes.forEach(box => {
            box.addEventListener('click', () => showListScreen(box.dataset.week));
        });

        backBtn.addEventListener('click', showHomeScreen);
        editBtn.addEventListener('click', toggleEditMode);
        addItemBtn.addEventListener('click', addItem);
        newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addItem();
            }
        });
    };

    init(); // Start the app
});