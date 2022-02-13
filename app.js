const inputField = document.querySelector('#add');
const todoList = document.querySelector('.todo-list');
let todoElements = document.querySelectorAll('.todo');
let todo = []
const complatedList = document.querySelector('.complated-list')
const complatedDiv = document.querySelector('.complated')
const activeTodoDiv = document.querySelector('.active-todo')
const complatedBtn = document.querySelector('.menu-item-complated')
const tasksBtn = document.querySelector('.menu-item-tasks')
const clearHistory = document.querySelector('.clear-history');
const categorySelect = document.querySelector('.category-select');
const addBtn = document.querySelector('.addBtn')
const createProjectBtn = document.querySelector('.createProjectBtn')
const createProjectInput = document.querySelector('#createProject')
const listscontainer = document.querySelector('.lists-container')
const projectsMenu = document.querySelector('.projects')
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const container = document.querySelector('.container')
const search = document.querySelector('.search-container input')
const userContainer = document.querySelector('.user-coontainer')
const addTaskHidden = document.querySelector('.add-task-hidden');
const addTask = document.querySelector('.add-task');
const cancelBtn = document.querySelector('.cancelBtn');
const main = document.querySelector('main');
const categoryBtn = document.querySelector('.categoryBtn');


let categorySelected = ''
let categories = []


let id = 1

class TodoItem {

    constructor(text) {
        this.text = text,
            this.deleted = false
        this.id
        this.category
    }
}

const setDisplayNone = (className) => {

    const containerChildren = Array.from(listscontainer.children)

    containerChildren.forEach(e => {
        if (e.className != className) {
            e.setAttribute('style', 'display:none')
        } else {
            e.setAttribute('style', 'display: block')
        }

    })
}

function deleteTodo(e) {
    console.log('src', e.target.classList[0])
    let element

    if (menu.classList[1] != 'show') {
        console.log('do nothing')
    } else {

        if (e.target.classList[0] != 'todo') {
            element = e.target.parentNode
        } else {
            element = e.target
        }

        element.children[0].children[0].style = 'display: inline-block;'
        setTimeout(() => {
        element.remove()
        }, 300)
        
        const deletedEl = todo.find(el => el.id === element.id)
        deletedEl.deleted = true
        const jsonList = JSON.stringify(todo)
        localStorage.setItem('todo', jsonList)
        const li = createDeletedTodoElement(element.innerText)
        li.id = element.id
        complatedList.appendChild(li)
    }
}

const createTodoElement = (e) => {
    const li = document.createElement('li');
    const logo = document.createElement('div');
    const span = document.createElement('span');
    const div = document.createElement('div');
    div.setAttribute('style', 'display: inline-block;')
    logo.setAttribute('class', 'logo')
    logo.appendChild(span)
    // console.log(checkbox)
    li.appendChild(logo)
    li.appendChild(div)
    li.setAttribute('class', 'todo')
    li.setAttribute('onclick', 'deleteTodo(event)')
    li.setAttribute('id', id++)
    li.draggable = true;
    div.innerText = e
    // console.log(li.children)
    drag()
    // li.innerHTML += e
    return li
}

const createDeletedTodoElement = (e) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.setAttribute('class', 'logo')
    li.appendChild(span)
    li.setAttribute('class', 'complated-todo')

    li.innerText = e
    
    return li
}



document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        const storage = JSON.parse(localStorage.getItem('todo'))
        if (storage) {
            storage.forEach((e) => {
                if (e.deleted === false) {
                    const li = createTodoElement(e.text)
                    li.id = e.id
                    todoList.appendChild(li)
                }
                if (e.deleted === true) {
                    createDeletedTodoElement(e.text)
                }
                todo.push(e)
            })

        }

        const categoryStorage = JSON.parse(localStorage.getItem('categories'))
        if (categoryStorage) {
            categories = categoryStorage

            const create = () => {
                categories.forEach(e => {
                    createProject(e.split('_').join(' '))
                })
            }
            create()
        }

    }

}



complatedBtn.addEventListener('click', () => {

    setDisplayNone('complated')
    addTaskHidden.setAttribute('style', 'display: none;')
    addTask.setAttribute('style', 'display: none;')
    showHideMenu()

    const allTasks = todo.filter(e => e.deleted === true)

    const children = Array.from(complatedList.children)

    children.forEach((e) => {
        e.remove()
    })

    allTasks.forEach((e) => {
        const li = createDeletedTodoElement(e.text)
        li.id = e.id
        complatedList.appendChild(li)
    })

})

tasksBtn.addEventListener('click', () => {
    setDisplayNone('active-todo')
    addTaskHidden.setAttribute('style', 'display: block;')
    showHideMenu()


    const allTasks = todo.filter(e => e.deleted === false)

    const children = Array.from(todoList.children)

    children.forEach((e) => {
        e.remove()
    })

    allTasks.forEach((e) => {
        const li = createTodoElement(e.text)
        li.id = e.id
        todoList.appendChild(li)
    })

})

clearHistory.addEventListener('click', () => {
    todo = todo.filter(e => e.deleted === false)
    const jsonList = JSON.stringify(todo)
    localStorage.setItem('todo', jsonList)

    const complatedTodo = document.querySelectorAll('.complated-todo')
    complatedTodo.forEach(e => {
        e.remove()
    })
})


categoryBtn.addEventListener('click', () => {
   const style = categorySelect.getAttribute('style');
//    console.log(style)

   if(style === 'display: block'){
    categorySelect.setAttribute('style', 'display: none')
   }else{
    if (categories.length === 0) {
        categorySelect.setAttribute('style', 'display: none')
    } else {
        categorySelect.setAttribute('style', 'display: block')
    }
   }



})


addBtn.addEventListener('click', () => {
    const input = inputField.value;

    if (input) {

        const newTodo = new TodoItem(input)
        const li = createTodoElement(newTodo.text)

        newTodo.id = li.id

        newTodo.category = categorySelected

        if (categorySelected != '') {
            const categoryDiv = document.querySelector(`.${categorySelected}List`)
            const li2 = createTodoElement(newTodo.text)
            li2.id = newTodo.id
            categoryDiv.appendChild(li2)
        }
        todoList.appendChild(li)
        todo.push(newTodo)
        const jsonList = JSON.stringify(todo)
        localStorage.setItem('todo', jsonList)
        // categorySelected = ''
        inputField.value = ''
    }

    categorySelect.setAttribute('style', 'display: none')
})

const dummyCategory  = () => {
    categoryBtn.children[1].innerText = 'All Tasks'
    categorySelected = ''
    setTimeout(() => {
        categorySelect.setAttribute('style', 'display: none;')
    },300)
}

const getCategory = (e) => {
    console.log(categoryBtn.children[1])
    categoryBtn.children[1].innerText = e.target.innerText
    
    categorySelected = e.target.className
    setTimeout(() => {
        categorySelect.setAttribute('style', 'display: none;')
    },300)
    
}

const showProject = (e) => {
    let myProjectList,id
    if(e.target.id){
        console.log('the id is:', e.target.id)
        id = e.target.id
         myProjectList = document.querySelector(`.${id} ul`)
         console.log('project list:', myProjectList)
    }else{
        console.log('the id is:', e.target.parentNode.id)
        id = e.target.parentNode.id
         myProjectList = document.querySelector(`.${id} ul`)
         console.log('project list:', myProjectList)
    }
    
    setDisplayNone(id)
    showHideMenu()
    if (localStorage.getItem('todo')) {

        todo = JSON.parse(localStorage.getItem('todo'))
        const myProjectItems = todo.filter(el => el.category === id && el.deleted === false)
        const children = Array.from(myProjectList.children)
        if (children.length > 0) {
            children.forEach((e) => {
                e.remove()
            })
        }

        myProjectItems.forEach((e) => {
            const li = createTodoElement(e.text)
            li.id = e.id
            myProjectList.appendChild(li)
        })
    }
}

createProjectBtn.addEventListener('click', () => {
    const inputValue = createProject()
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    const test = regex.test(inputValue)
    console.log(test)
    console.log('input:', inputValue)
    if (!test && inputValue != undefined || !test && inputValue != null) {
        console.log('test before pushing:', test)
        console.log('pushing category', inputValue)
        categories.push(inputValue)
        localStorage.setItem('categories', JSON.stringify(categories))
    }
    createProjectInput.value = ''


})

const createProject = (input) => {
    //creating new menu-item btn

    const inputValue = createProjectInput.value || input
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/g;

    const test = regex.test(inputValue)
    // const checkNum = parseInt(inputValue)
    console.log('outside: ', test)
    console.log('outside: ', inputValue)
    // console.log('outside: ', checkNum)
    if (!test && inputValue != undefined || !test && inputValue != null) {

        //create button in menu
        const menuDiv = document.createElement('div')
        const li = document.createElement('li')
        const deleteBtn = document.createElement('div');
        const span = document.createElement('span');
        const circle = document.createElement('div');
        circle.setAttribute('class', 'circle');

        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        circle.style.backgroundColor = `#${randomColor}`

        menuDiv.appendChild(circle)

        span.innerText = inputValue
        menuDiv.appendChild(span)
        menuDiv.id = inputValue.split(' ').join('')
        
        menuDiv.setAttribute('class', 'project')
        menuDiv.setAttribute('onclick', 'showProject(event)')
        deleteBtn.setAttribute('class', 'delete-project-btn')
        deleteBtn.setAttribute('onclick', 'deleteProject(event)')
        deleteBtn.innerText = 'Delete'
        li.appendChild(menuDiv)
        li.appendChild(deleteBtn)
        projectsMenu.appendChild(li)

        //create new btn in category select and push it to categories array
        const categorySelectDiv = document.createElement('div')
        categorySelectDiv.setAttribute('class', inputValue.split(' ').join(''))
        categorySelectDiv.setAttribute('onclick', 'getCategory(event)')
        categorySelectDiv.innerText = inputValue
        categorySelect.appendChild(categorySelectDiv)

        //create a div to display tasks
        const categoryTasksDiv = document.createElement('div')
        categoryTasksDiv.setAttribute('class', inputValue.split(' ').join(''))
        categoryTasksDiv.setAttribute('style', 'display:none')
        const categoryTasksUl = document.createElement('ul')
        categoryTasksUl.setAttribute('class', `${inputValue.split(' ').join('')}List`)
        categoryTasksDiv.appendChild(categoryTasksUl)
        listscontainer.appendChild(categoryTasksDiv)

        createProjectInput.value = ''
        return inputValue.split(' ').join('_')
    } else {
        console.log('wrong input')
        console.log('outside: ', inputValue)
    }

}

const deleteProject = (e) => {
    const projectName = e.target.parentNode.children[0].innerText;

    //remove categorie from all tasks
    const allTasks = todo.filter(el => el.category === projectName)
    allTasks.forEach(el => {
        el.category = ''
    })
    localStorage.setItem('todo', JSON.stringify(todo))


    //remove category from array and update localstorage
    const index = categories.indexOf(projectName)
    categories.splice(index, 1)
    localStorage.setItem('categories', JSON.stringify(categories))

    //remove tasks div
    const tasksDiv = document.querySelector(`.${projectName}`)
    tasksDiv.remove()

    //remove menu element
    e.target.parentNode.remove()
}

burger.addEventListener('click', () => {
    console.log('burger')
    menu.classList.toggle("show");
})

search.addEventListener('focus', () => {
    if(window.outerWidth < 504){
    userContainer.setAttribute('style', 'display: none;')
    }
})
search.addEventListener('focusout', () => {
    if(window.outerWidth < 504){
    userContainer.removeAttribute('style')
    }
})

const showHideMenu = (e) => {
try{
    if (e.target.classList[0] != 'menu' && e.target.parentNode.classList[0] != 'create-project' && e.target.innerText != 'Projects') {
        if (menu.classList[1] != 'show') {
            menu.classList.add('show')
        } else {
            console.log('not showing menu')
        }
    }
}catch{
    console.log('no classlist')
}
}


addTaskHidden.addEventListener('click', () => {
    if (menu.classList[1] != 'show') {
        console.log('do nothing')
    } else {
        addTask.setAttribute('style', 'display: flex')
        addTaskHidden.setAttribute('style', 'display: none')
        categoryBtn.children[1].innerText = 'All Tasks'
        categorySelected = ''
    }
})

cancelBtn.addEventListener('click', () => {
    addTask.setAttribute('style', 'display: none')
    addTaskHidden.setAttribute('style', 'display: block')
})


//Implement dark mode
//implement draggable li

const getDragAfterElement = (y) => {
    const draggableElements = [...todoList.querySelectorAll('.todo:not(.dragging)')]
    
    return draggableElements.reduce((closest,child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height /2

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}

const drag = () => {
    let draggableLi

    setTimeout(() => {
        draggableLi = Array.from(todoList.children)

        draggableLi.forEach(draggable => {

            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging')
            })

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging')
                
            })
        })

        todoList.addEventListener('dragover', (e) => {
            e.preventDefault()

            const draggable = document.querySelector('.dragging')

            const afterElement = getDragAfterElement(e.clientY)

            if(afterElement == null){
                todoList.appendChild(draggable)
            }else {
                todoList.insertBefore(draggable, afterElement)
            }            
            
        })

    },300)
}

drag()


