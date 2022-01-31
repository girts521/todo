"use strict";

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
  var element = e.target;
  element.remove();
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

var createTodoElement = function createTodoElement(e) {
  var li = document.createElement('li');
  var span = document.createElement('span');
  span.setAttribute('class', 'logo');
  li.appendChild(span);
  li.setAttribute('class', 'todo');
  li.setAttribute('onclick', 'deleteTodo(event)');
  li.setAttribute('id', id++);
  li.innerText = e;
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
inputField.addEventListener('input', function () {
  if (categories.length === 0) {
    categorySelect.setAttribute('style', 'display: none');
  } else {
    categorySelect.setAttribute('style', 'display: block');
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
    localStorage.setItem('todo', jsonList);
    categorySelected = '';
    inputField.value = '';
  }

  categorySelect.setAttribute('style', 'display: none');
});

var getCategory = function getCategory(e) {
  categorySelected = e.target.className;
};

var showProject = function showProject(e) {
  var myProjectList = document.querySelector(".".concat(e.target.id, " ul"));
  setDisplayNone(e.target.id);

  if (localStorage.getItem('todo')) {
    todo = JSON.parse(localStorage.getItem('todo'));
    var myProjectItems = todo.filter(function (el) {
      return el.category === e.target.id && el.deleted === false;
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
  var regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
  var test = regex.test(inputValue); // const checkNum = parseInt(inputValue)

  console.log('outside: ', test);
  console.log('outside: ', inputValue); // console.log('outside: ', checkNum)

  if (!test && inputValue != undefined || !test && inputValue != null) {
    // console.log('inside: ',test)
    // console.log('inside: ',inputValue   )
    // console.log('inside: ', parseInt(inputValue))
    //create button in menu
    var menuDiv = document.createElement('div');
    var li = document.createElement('li');
    var deleteBtn = document.createElement('div');
    menuDiv.id = inputValue.split(' ').join('');
    menuDiv.innerText = inputValue;
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
  menu.classList.toggle("show");
}); //Implement dark mode
//implement draggable li