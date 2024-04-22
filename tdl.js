const state = {
    tasklist: [],
};

const taskcontents = document.querySelector(".task_content");
const taskModal = document.querySelector(".task__modal___body");

const htmlTaskcontent = ({url, title, type, description, id}) => `
<div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
<div class="card shadow-sm task_card">
<div class="card-header d-flex justify-content-end task_card_header">
<button type="button" class="btn btn-outline-primary mr-2" name=${id}>
<i class=" fas fa-pencil-alt" name=${id}></i>
</button>
<button type="button" class="btn btn-outline-danger mr-2" name=${id}>
<i class=" fas fa-trash-alt" name=${id} onclick="DeleteTask.apply(this, arguments)"></i>
</button>
</div>
<div class="card-body">
${
    url ?
    `<img width="100%" src=${url} alt="card image top" class="card-img-top mt-3 rounded-lg"/>`:
    `<img width="100%" src="https://t3.ftcdn.net/jpg/02/68/55/60/360_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg" alt="card image top" class="img-fluid place_holder_image mt-3 rounded-lg"/>`
}
<h4 class="card-title  text_title">
${title}
</h4>
<p class="description card-text trim-3-lines text-muted ">${description}</p>
<div class="tags text-white d-flex flex-wrap">
<span class="badge text-bg-primary m-1 ">${type}</span>
</div>
<div class="card-footer">
<button class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showtask" 
id= ${id} onclick="openTask.apply(this, arguments)"> Open Task</button>
</div>
</div>
</div>
</div>
`
const htmlModalContent = ({id, title, url, description}) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
    ${
        url ?
        `<img width="100%" src=${url} alt="card image top" class="img-fluid place_holder_image mt-3 rounded-lg"/>`:
        `<img width="100%" src="https://t3.ftcdn.net/jpg/02/68/55/60/360_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg" alt="card image top" class="img-fluid place_holder_image mt-3 rounded-lg"/>`
    }
    <strong>Created on ${date.toDateString()} </strong>
    <h2 class="my-3">${title}</h2>
    <p class="lead">${description}</p>
    </div>
    `
}

const UpdateLocalStorage = () => {
   localStorage.setItem("task", JSON.stringify({
    tasks: state.tasklist,
   }))
}

const loadInitialData = () => {
    const localStoragecopy = JSON.parse(localStorage.task)

    if(localStoragecopy) state.tasklist = localStoragecopy.tasks;

    state.tasklist.map((cardDate)=>{
        taskcontents.insertAdjacentHTML("beforeend", htmlTaskcontent(cardDate))
    })
}

const handleSubmit = (event) =>{
const id = Date.now();
console.log(id);
const input = {
    url: document.getElementById('Imageurl').value,
    title: document.getElementById('tasktitle').value,
    description: document.getElementById('taskdesc').value,
    type: document.getElementById('tags').value,
};

if(input.title === "" || input.description === "" || input.type ===""){
    return alert("please fill all required fields")
}

taskcontents.insertAdjacentHTML("beforeend", htmlTaskcontent({
    ...input,
    id
}))

state.tasklist.push({...input, id});
UpdateLocalStorage();
}

const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.tasklist.find(({id}) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
}

const DeleteTask = (e) => {
    if(!e) e = window.event;

    const targetid = e.target.getAttribute("name");
    const type = e.target.tagName;

    const removeTask = state.tasklist.filter(({id})=> id!== targetid);
    state.tasklist = removeTask;
    UpdateLocalStorage();
    
    if(type === "BUTTON"){
        return e.target.parentNode.parentNode.parentNode
    }
    return
}
// http status code
