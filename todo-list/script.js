// LIST CONTROLLER
var listController = (function() {
    var Task = function(id, description) {
        this.id = id;
        this.description = description;
    };

    var allTasks = [];

    return {
        addItem: function(des) {
            var newItem, ID;

            // ID = last ID + 1;
            // Create new ID
            if (allTasks.length > 0) {
                ID = allTasks[allTasks.length - 1].id + 1;
            } else {
                ID = 0;
            }

            newItem = new Task(ID, des);

            // Push it into our data structure
            allTasks.push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(id) {
            var ids, index;

            ids = allTasks.map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                allTasks.splice(index, 1);
            }
        },

        testing: function() {
            console.log(allTasks);
        }

    };

})();

// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputDescription: ".add-description",
        inputBtn: ".add-btn",
        itemContainer: ".task-list",
        container: '.container',
        dateLabel: '.month-title'
    };

    return {
        getInput: function() {
            return {
                description: document.querySelector(DOMstrings.inputDescription).value,
            };
        },

        addListItem: function(obj) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            element = DOMstrings.itemContainer;

            html = '<div class="item clearfix" id="income-%id%"><div class="status"><div class="item__delete"><button class="item__delete--btn">' +
                '<i class="ion-ios-circle-outline"></i><i class="ion-ios-checkmark-outline"></i></button></div></div>' +
                '<div class="item__description">%description%</div><div class="delete-icon"><button class="delete-btn">' +
                '<i class="ion-ios-trash-outline"></i></button></div></div>';

            // Replace the placeholder text with the actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        completeListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.children[1].style.textDecoration = 'line-through';
            el.children[0].children[0].children[0].children[0].style.display = "none";
            el.children[0].children[0].children[0].children[1].style.display = "inline";
        },

        clearFields: function() {
            var field, fieldArr;

            field = document.querySelectorAll(DOMstrings.inputDescription);

            fieldArr = Array.prototype.slice.call(field);

            fieldArr.forEach(function(current) {
                current.value = "";
            });

            fieldArr[0].focus();
        },

        displayMonth: function() {
            var now, months, month, date, year;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ];

            month = now.getMonth();
            date = now.getDate();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + date + ', ' + year;
        },

        getDOMstrings: function() {
            return DOMstrings;
        },
    };
})();

// GLOBAL APP CONTROLLER
var controller = (function(listCtrl, UICtrl) {
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.container).addEventListener('click', ctrlCompleteItem);

    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getInput();

        if (input.description !== "" && input.description.length < 140) {
            // 2. Add the item to the list controller
            newItem = listCtrl.addItem(input.description);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem);

            // 4. Clear the fields
            UICtrl.clearFields();

        }
    };

    var ctrlCompleteItem = function() {
        var itemID;

        try {
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

            if (itemID) {
                splitID = itemID.split('-');
                ID = parseInt(splitID[1]);

                UICtrl.completeListItem(itemID);
            }
        } catch (err) {
            console.log('The id of the element has been deleted.');
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID;

        itemID = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            listCtrl.deleteItem(ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
        }

    };

    return {
        init: function() {
            console.log("Application has started.");
            UICtrl.displayMonth();
            setupEventListeners();
        },
    };
})(listController, UIController);

controller.init();