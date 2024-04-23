const state = {
    tasklist: [],
};

const taskcontents = document.querySelector(".task_content");
const taskModal = document.querySelector(".task__modal___body");

const htmlTaskcontent = ({url, title, type, description, id}) => `
<div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
<div class="card shadow-sm task_card">
<div class="card-header d-flex justify-content-end task_card_header">
<button type="button" class="btn btn-outline-primary mr-2" name=${id} onclick="editTask.apply(this, arguments)">
<i class= "fas fa-pencil-alt" name=${id}></i>
</button>
<button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask.apply(this, arguments)">
<i class=" fas fa-trash-alt" name=${id} ></i>
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
<button class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showtask" id=${id} onclick="openTask.apply(this, arguments)"> Open Task</button>
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
const id = `${Date.now()}`;
//console.log(id);
const input = {
    url: document.getElementById('Imageurl').value,
    title: document.getElementById('tasktitle').value,
    description: document.getElementById('taskdesc').value,
    type: document.getElementById('tags').value,
};

if(input.title === "" || input.description === "" || input.type === ""){
    return alert("please fill all required fields")
}

taskcontents.insertAdjacentHTML("beforeend", htmlTaskcontent({
    ...input,
    id
}))

state.tasklist.push({...input, id});
UpdateLocalStorage();
location.reload();
}

const openTask = (e) => {
    if(!e) e= window.event;

    const getTask = state.tasklist.find(({id})=> id === e.target.id);
    //console.log(getTask);
    taskModal.innerHTML = htmlModalContent(getTask);
}

const deleteTask = (e) => {
    if(!e) e= window.event;

    const targetId = e.target.getAttribute("name");
    const type = e.target.tagName;
//console.log(type)
    const removeTask = state.tasklist.filter(({id})=> id!== targetId);
    //console.log(removeTask)
    state.tasklist = removeTask;
    UpdateLocalStorage();
    location.reload();

    if(type === "BUTTON"){
        return e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode)
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode)
}

const editTask = (e) => {
    
    if(!e) e = window.event;

    const targetId = e.target.id;
    const type = e.target.tagName;


    let parentNode;
    let tasktitle;
    let taskdesc;
    let tags;
    let submitButton;

    if(type === "BUTTON"){
        parentNode = e.target.parentNode.parentNode;
    } else{
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

tasktitle = parentNode.childNodes[3].childNodes[3];
//console.log(tasktitle)
taskdesc = parentNode.childNodes[3].childNodes[5];
tags = parentNode.childNodes[3].childNodes[7].childNodes[1];
submitButton = parentNode.childNodes[3].childNodes[9];
//console.log(submitButton)
tasktitle.setAttribute("contenteditable", "true");
taskdesc.setAttribute("contenteditable", "true");
tags.setAttribute("contenteditable", "true");

submitButton.setAttribute('onclick', "saveEdit.apply(this, arguments)");
 submitButton.removeAttribute("data-bs-toggle");
 submitButton.removeAttribute("data-bs-target");
 submitButton.innerHTML = "Save Changes"
}

const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;

    tasktitle = parentNode.childNodes[3].childNodes[3];
//console.log(tasktitle)
taskdesc = parentNode.childNodes[3].childNodes[5];
tags = parentNode.childNodes[3].childNodes[7].childNodes[1];
submitButton = parentNode.childNodes[3].childNodes[9];


const updateData = {
    tasktitle: tasktitle.innerHTML,
    taskdesc: taskdesc.innerHTML,
    tags: tags.innerHTML,
}

let stateCopy = state.tasklist;

stateCopy = stateCopy.map((task)=> 
task.id === targetId ?
{
id: task.id,
title: updateData.tasktitle,
description: updateData.taskdesc,
tags: updateData.tags,
url: task.url,
}
:
task
);

state.tasklist = stateCopy;
UpdateLocalStorage();


tasktitle.setAttribute("contenteditable", "false");
taskdesc.setAttribute("contenteditable", "false");
tags.setAttribute("contenteditable", "false");

submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
submitButton.setAttribute("data-bs-toggle", "modal");
 submitButton.setAttribute("data-bs-target", "#showtask");
 submitButton.innerHTML = "Open Task"
}

const searchTask = (e) => {
    if(!e) e= window.event;

    while(taskcontents.firstChild){
        taskcontents.removeChild(taskcontents.firstChild)
    }

    const resultData = state.tasklist.filter(({title})=> title.includes(e.target.value));
    //console.log(resultData)

    resultData.map((cardData)=>{
        taskcontents.insertAdjacentHTML("beforeend", htmlTaskcontent(cardData));
    })
}