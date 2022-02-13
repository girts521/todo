"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var inputField = document.querySelector('#add');
var todoList = document.querySelector('.todo-list');
var todoElements = document.querySelectorAll('.todo');
var todo = [];
var complatedList = document.querySelector('.complated-list');
var complatedDiv = document.querySelector('.complated');
var activeTodoDiv = document.querySelector('.active-todo');
var complatedBtn = document.querySelector('.menu-item-complated');
var tasksBtn = document.querySelector('.menu-item-tasks');
var clearHistory = document.querySelector('.clear-history');
var categorySelect = document.querySelector('.category-select');
var addBtn = document.querySelector('.addBtn');
var createProjectBtn = document.querySelector('.createProjectBtn');
var createProjectInput = document.querySelector('#createProject');
var listscontainer = document.querySelector('.lists-container');
var projectsMenu = document.querySelector('.projects');
var burger = document.querySelector('.burger');
var menu = document.querySelector('.menu');
var container = document.querySelector('.container');
var search = document.querySelector('.search-container input');
var userContainer = document.querySelector('.user-coontainer');
var addTaskHidden = document.querySelector('.add-task-hidden');
var addTask = document.querySelector('.add-task');
var cancelBtn = document.querySelector('.cancelBtn');
var main = document.querySelector('main');
var categoryBtn = document.querySelector('.categoryBtn');
var categorySelected = '';
var categories = [];
var id = 1;

var TodoItem = function TodoItem(text) {
  _classCallCheck(this, TodoItem);

  this.text = text, this.deleted = false;
  this.id;
  this.category;
};

var setDisplayNone = function setDisplayNone(className) {
  var containerChildren = Array.from(listscontainer.children);
  containerChildren.forEach(function (e) {
    if (e.className != className) {
      e.setAttribute('style', 'display:none');
    } else {
      e.setAttribute('style', 'display: block');
    }
  });
};

function deleteTodo(e) {
  console.log('src', e.target.classList[0]);
  var element;

  if (menu.classList[1] != 'show') {
    console.log('do nothing');
  } else {
    if (e.target.classList[0] != 'todo') {
      element = e.target.parentNode;
    } else {
      element = e.target;
    }

    element.children[0].children[0].style = 'display: inline-block;';
    setTimeout(function () {
      element.remove();
    }, 300);
    var deletedEl = todo.find(function (el) {
      return el.id === element.id;
    });
    deletedEl.deleted = true;
    var jsonList = JSON.stringify(todo);
    localStorage.setItem('todo', jsonList);
    var li = createDeletedTodoElement(element.innerText);
    li.id = element.id;
    complatedList.appendChild(li);
  }
}

var createTodoElement = function createTodoElement(e) {
  var li = document.createElement('li');
  var logo = document.createElement('div');
  var span = document.createElement('span');
  var div = document.createElement('div');
  div.setAttribute('style', 'display: inline-block;');
  logo.setAttribute('class', 'logo');
  logo.appendChild(span); // console.log(checkbox)

  li.appendChild(logo);
  li.appendChild(div);
  li.setAttribute('class', 'todo');
  li.setAttribute('onclick', 'deleteTodo(event)');
  li.setAttribute('id', id++);
  li.draggable = true;
  div.innerText = e; // console.log(li.children)

  drag(); // li.innerHTML += e

  return li;
};

var createDeletedTodoElement = function createDeletedTodoElement(e) {
  var li = document.createElement('li');
  var span = document.createElement('span');
  span.setAttribute('class', 'logo');
  li.appendChild(span);
  li.setAttribute('class', 'complated-todo');
  li.innerText = e;
  return li;
};

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var storage = JSON.parse(localStorage.getItem('todo'));

    if (storage) {
      storage.forEach(function (e) {
        if (e.deleted === false) {
          var li = createTodoElement(e.text);
          li.id = e.id;
          todoList.appendChild(li);
        }

        if (e.deleted === true) {
          createDeletedTodoElement(e.text);
        }

        todo.push(e);
      });
    }

    var categoryStorage = JSON.parse(localStorage.getItem('categories'));

    if (categoryStorage) {
      categories = categoryStorage;

      var create = function create() {
        categories.forEach(function (e) {
          createProject(e.split('_').join(' '));
        });
      };

      create();
    }
  }
};

complatedBtn.addEventListener('click', function () {
  setDisplayNone('complated');
  addTaskHidden.setAttribute('style', 'display: none;');
  addTask.setAttribute('style', 'display: none;');
  showHideMenu();
  var allTasks = todo.filter(function (e) {
    return e.deleted === true;
  });
  var children = Array.from(complatedList.children);
  children.forEach(function (e) {
    e.remove();
  });
  allTasks.forEach(function (e) {
    var li = createDeletedTodoElement(e.text);
    li.id = e.id;
    complatedList.appendChild(li);
  });
});
tasksBtn.addEventListener('click', function () {
  setDisplayNone('active-todo');
  addTaskHidden.setAttribute('style', 'display: block;');
  showHideMenu();
  var allTasks = todo.filter(function (e) {
    return e.deleted === false;
  });
  var children = Array.from(todoList.children);
  children.forEach(function (e) {
    e.remove();
  });
  allTasks.forEach(function (e) {
    var li = createTodoElement(e.text);
    li.id = e.id;
    todoList.appendChild(li);
  });
});
clearHistory.addEventListener('click', function () {
  todo = todo.filter(function (e) {
    return e.deleted === false;
  });
  var jsonList = JSON.stringify(todo);
  localStorage.setItem('todo', jsonList);
  var complatedTodo = document.querySelectorAll('.complated-todo');
  complatedTodo.forEach(function (e) {
    e.remove();
  });
});
categoryBtn.addEventListener('click', function () {
  var style = categorySelect.getAttribute('style'); //    console.log(style)

  if (style === 'display: block') {
    categorySelect.setAttribute('style', 'display: none');
  } else {
    if (categories.length === 0) {
      categorySelect.setAttribute('style', 'display: none');
    } else {
      categorySelect.setAttribute('style', 'display: block');
    }
  }
});
addBtn.addEventListener('click', function () {
  var input = inputField.value;

  if (input) {
    var newTodo = new TodoItem(input);
    var li = createTodoElement(newTodo.text);
    newTodo.id = li.id;
    newTodo.category = categorySelected;

    if (categorySelected != '') {
      var categoryDiv = document.querySelector(".".concat(categorySelected, "List"));
      var li2 = createTodoElement(newTodo.text);
      li2.id = newTodo.id;
      categoryDiv.appendChild(li2);
    }

    todoList.appendChild(li);
    todo.push(newTodo);
    var jsonList = JSON.stringify(todo);
    localStorage.setItem('todo', jsonList); // categorySelected = ''

    inputField.value = '';
  }

  categorySelect.setAttribute('style', 'display: none');
});

var dummyCategory = function dummyCategory() {
  categoryBtn.children[1].innerText = 'All Tasks';
  categorySelected = '';
  setTimeout(function () {
    categorySelect.setAttribute('style', 'display: none;');
  }, 300);
};

var getCategory = function getCategory(e) {
  console.log(categoryBtn.children[1]);
  categoryBtn.children[1].innerText = e.target.innerText;
  categorySelected = e.target.className;
  setTimeout(function () {
    categorySelect.setAttribute('style', 'display: none;');
  }, 300);
};

var showProject = function showProject(e) {
  var myProjectList, id;

  if (e.target.id) {
    console.log('the id is:', e.target.id);
    id = e.target.id;
    myProjectList = document.querySelector(".".concat(id, " ul"));
    console.log('project list:', myProjectList);
  } else {
    console.log('the id is:', e.target.parentNode.id);
    id = e.target.parentNode.id;
    myProjectList = document.querySelector(".".concat(id, " ul"));
    console.log('project list:', myProjectList);
  }

  setDisplayNone(id);
  showHideMenu();

  if (localStorage.getItem('todo')) {
    todo = JSON.parse(localStorage.getItem('todo'));
    var myProjectItems = todo.filter(function (el) {
      return el.category === id && el.deleted === false;
    });
    var children = Array.from(myProjectList.children);

    if (children.length > 0) {
      children.forEach(function (e) {
        e.remove();
      });
    }

    myProjectItems.forEach(function (e) {
      var li = createTodoElement(e.text);
      li.id = e.id;
      myProjectList.appendChild(li);
    });
  }
};

createProjectBtn.addEventListener('click', function () {
  var inputValue = createProject();
  var regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
  var test = regex.test(inputValue);
  console.log(test);
  console.log('input:', inputValue);

  if (!test && inputValue != undefined || !test && inputValue != null) {
    console.log('test before pushing:', test);
    console.log('pushing category', inputValue);
    categories.push(inputValue);
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  createProjectInput.value = '';
});

var createProject = function createProject(input) {
  //creating new menu-item btn
  var inputValue = createProjectInput.value || input;
  var regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/g;
  var test = regex.test(inputValue); // const checkNum = parseInt(inputValue)

  console.log('outside: ', test);
  console.log('outside: ', inputValue); // console.log('outside: ', checkNum)

  if (!test && inputValue != undefined || !test && inputValue != null) {
    //create button in menu
    var menuDiv = document.createElement('div');
    var li = document.createElement('li');
    var deleteBtn = document.createElement('div');
    var span = document.createElement('span');
    var circle = document.createElement('div');
    circle.setAttribute('class', 'circle');
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    circle.style.backgroundColor = "#".concat(randomColor);
    menuDiv.appendChild(circle);
    span.innerText = inputValue;
    menuDiv.appendChild(span);
    menuDiv.id = inputValue.split(' ').join('');
    menuDiv.setAttribute('class', 'project');
    menuDiv.setAttribute('onclick', 'showProject(event)');
    deleteBtn.setAttribute('class', 'delete-project-btn');
    deleteBtn.setAttribute('onclick', 'deleteProject(event)');
    deleteBtn.innerText = 'Delete';
    li.appendChild(menuDiv);
    li.appendChild(deleteBtn);
    projectsMenu.appendChild(li); //create new btn in category select and push it to categories array

    var categorySelectDiv = document.createElement('div');
    categorySelectDiv.setAttribute('class', inputValue.split(' ').join(''));
    categorySelectDiv.setAttribute('onclick', 'getCategory(event)');
    categorySelectDiv.innerText = inputValue;
    categorySelect.appendChild(categorySelectDiv); //create a div to display tasks

    var categoryTasksDiv = document.createElement('div');
    categoryTasksDiv.setAttribute('class', inputValue.split(' ').join(''));
    categoryTasksDiv.setAttribute('style', 'display:none');
    var categoryTasksUl = document.createElement('ul');
    categoryTasksUl.setAttribute('class', "".concat(inputValue.split(' ').join(''), "List"));
    categoryTasksDiv.appendChild(categoryTasksUl);
    listscontainer.appendChild(categoryTasksDiv);
    createProjectInput.value = '';
    return inputValue.split(' ').join('_');
  } else {
    console.log('wrong input');
    console.log('outside: ', inputValue);
  }
};

var deleteProject = function deleteProject(e) {
  var projectName = e.target.parentNode.children[0].innerText; //remove categorie from all tasks

  var allTasks = todo.filter(function (el) {
    return el.category === projectName;
  });
  allTasks.forEach(function (el) {
    el.category = '';
  });
  localStorage.setItem('todo', JSON.stringify(todo)); //remove category from array and update localstorage

  var index = categories.indexOf(projectName);
  categories.splice(index, 1);
  localStorage.setItem('categories', JSON.stringify(categories)); //remove tasks div

  var tasksDiv = document.querySelector(".".concat(projectName));
  tasksDiv.remove(); //remove menu element

  e.target.parentNode.remove();
};

burger.addEventListener('click', function () {
  console.log('burger');
  menu.classList.toggle("show");
});
search.addEventListener('focus', function () {
  if (window.outerWidth < 504) {
    userContainer.setAttribute('style', 'display: none;');
  }
});
search.addEventListener('focusout', function () {
  if (window.outerWidth < 504) {
    userContainer.removeAttribute('style');
  }
});

var showHideMenu = function showHideMenu(e) {
  try {
    if (e.target.classList[0] != 'menu' && e.target.parentNode.classList[0] != 'create-project' && e.target.innerText != 'Projects') {
      if (menu.classList[1] != 'show') {
        menu.classList.add('show');
      } else {
        console.log('not showing menu');
      }
    }
  } catch (_unused) {
    console.log('no classlist');
  }
};

addTaskHidden.addEventListener('click', function () {
  if (menu.classList[1] != 'show') {
    console.log('do nothing');
  } else {
    addTask.setAttribute('style', 'display: flex');
    addTaskHidden.setAttribute('style', 'display: none');
    categoryBtn.children[1].innerText = 'All Tasks';
    categorySelected = '';
  }
});
cancelBtn.addEventListener('click', function () {
  addTask.setAttribute('style', 'display: none');
  addTaskHidden.setAttribute('style', 'display: block');
}); //Implement dark mode
//implement draggable li

var getDragAfterElement = function getDragAfterElement(y) {
  var draggableElements = _toConsumableArray(todoList.querySelectorAll('.todo:not(.dragging)'));

  return draggableElements.reduce(function (closest, child) {
    var box = child.getBoundingClientRect();
    var offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return {
        offset: offset,
        element: child
      };
    } else {
      return closest;
    }
  }, {
    offset: Number.NEGATIVE_INFINITY
  }).element;
};

var drag = function drag() {
  var draggableLi;
  setTimeout(function () {
    draggableLi = Array.from(todoList.children);
    draggableLi.forEach(function (draggable) {
      draggable.addEventListener('dragstart', function () {
        draggable.classList.add('dragging');
      });
      draggable.addEventListener('dragend', function () {
        draggable.classList.remove('dragging');
      });
    });
    todoList.addEventListener('dragover', function (e) {
      e.preventDefault();
      var draggable = document.querySelector('.dragging');
      var afterElement = getDragAfterElement(e.clientY);

      if (afterElement == null) {
        todoList.appendChild(draggable);
      } else {
        todoList.insertBefore(draggable, afterElement);
      }
    });
  }, 300);
};

drag();