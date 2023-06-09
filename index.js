const	addTaskDinamic = (objectTask) =>
{
	const	toDoList = document.getElementById("todo-list");
	const	doneList = document.getElementById("done-list");
	let	div = document.createElement("div");
	let p = document.createElement("p");
	let checkbox = document.createElement("input");
	let	index = objectTask.id;
		
	div.setAttribute("id", `div${index}`);
	p.setAttribute("id", `p${index}`);
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("class", "cb");
	checkbox.setAttribute("id", `cb${index}`);
	if (objectTask.status === 0)
	{
		p.setAttribute("class", "edit");
		toDoList.appendChild(div);
		//toDoList.appendChild(p);
		document.getElementById(`div${index}`).appendChild(p);
		document.getElementById(`p${index}`).contentEditable = "true";
		document.getElementById(`div${index}`).appendChild(checkbox);
	}
	else
		doneList.appendChild(p);
	document.getElementById(`p${index}`).innerText = objectTask.activity;
	console.log([...objectTask]);
}

/**
 * 
 * @param {*} task
 * @toDo
 * 		@id identificator for the task
 * 		@activity the task itself
 * 		@status
 * 			0; if the status is ToDo;
 * 			1; if the status is Done;
 * @returns
 */

const	jsonInitializer = (task) =>
{
	const	arr = [];
	const	toDo = 
	{
		id: 0,
		activity: task,
		status: 0,
	}
	arr[0] = toDo;
	console.log(JSON.stringify(arr));
	addTaskDinamic(toDo);
	return (JSON.stringify(arr));
}

const	newTask = (task) =>
{
	const	toDoObject = JSON.parse(localStorage.toDo);
	const	identifier = toDoObject.length;

	const	toDo = 
	{
		id: identifier,
		activity: task,
		status: 0,
	}
	toDoObject.push(toDo);
	localStorage.removeItem("toDo");
	localStorage.setItem("toDo", JSON.stringify(toDoObject));
	addTaskDinamic(toDo);
	console.log(localStorage.toDo);
}

const	createTask = (task) =>
{
	if (!localStorage.toDo)
		localStorage.setItem("toDo", jsonInitializer(task));
	else
	{
		newTask(task);
	}
}

const	storageWrite = () =>
{
	const	toDoList = document.getElementById("todo-list");
	const	doneList = document.getElementById("done-list");
	const	toDoObject = JSON.parse(localStorage.toDo);
	let		div;
	let		p;

	//toDoObject[3].status = 1;
	for (let i = 0; i < toDoObject.length; i++)
	{
		div = document.createElement("div");
		div.setAttribute("id", `div${i}`);
		p = document.createElement("p");
		p.setAttribute("id", `p${i}`);
		if (toDoObject[i].status === 0)
		{
			p.setAttribute("class", "edit");
			toDoList.appendChild(div);
			//toDoList.appendChild(p);
			document.getElementById(`div${i}`).appendChild(p);
			document.getElementById(`p${i}`).contentEditable = "true";
		}
		else
			doneList.appendChild(p);
		document.getElementById(`p${i}`).innerText = toDoObject[i].activity;
	}
	console.log(toDoObject);
	return (document.getElementsByClassName('edit'));
}

const	listPopulate = async() =>
{
	const	toDoList = document.getElementById("todo-list");
	const	doneList = document.getElementById("done-list");
	let		elements;

	if (!localStorage.toDo)
	{
		let message = document.createElement("h5");
		message.setAttribute("id", "opening-message");
		toDoList.appendChild(message);
		document.getElementById("opening-message").innerText = "No tasks added yet";
		doneList.appendChild(message.cloneNode(true));
	}
	else
	{
		elements = storageWrite();
	}
	return (elements);
}

const	saveChanges = () =>
{
	let 	changes = [...document.getElementsByClassName('edit')];
	const	toDoObject = JSON.parse(localStorage.toDo);
	let		newActivity;
	let		index;

	for (let change of changes)
	{
		newActivity = change.innerText;
		index = changes.indexOf(change);
		toDoObject[index].activity = newActivity;
	}
	localStorage.removeItem("toDo");
	localStorage.setItem("toDo", JSON.stringify(toDoObject));
	document.getElementById("save-btn").style.display = "none";
	console.log(localStorage.toDo);
	//console.log(test);
}

const	formListener = () =>
{
	let form = document.forms["form-task"];

	form.addEventListener("submit", (event) =>
	{
		event.preventDefault();
		createTask(this.task.value);
		document.getElementById("task").value = "";
	})
}

const	keyboardListener = (elements) =>
{
	for (let element of elements)
	{
		element.addEventListener("keydown", (event) =>
		{
			let	code = event.code;
			if (code === "Enter")
			{
				event.preventDefault();
				element.contentEditable = "false";
				element.contentEditable = "true";
			}
		})
	}
}

/**
 * In this function we first convert an HTML collection to array using
 * spread operator.
 * then we iterate each element of the array.
 * we use indexOf method to determine which element was changed.
 * @param {*} elements 
 */
const	updateListener = (elements) =>
{
	let arr = [...elements];

	for (let element of arr)
	{
		element.addEventListener("input", () =>
		{
			console.log(arr.indexOf(element));
			document.getElementById("save-btn").style.display = "block";
		})
	}
}

const	checkboxSet = (elements) =>
{
	const	elemenstArray = [...elements];
	let		checkbox;
	let		index;

	for (let element of elemenstArray)
	{
		index = elemenstArray.indexOf(element);
		checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("class", "cb");
		checkbox.setAttribute("id", `cb${index}`);
		document.getElementById(`div${index}`).appendChild(checkbox);
	}
}

/**
 * This function helps determine if the checkboxes were all 
 * unchecked.
 * 
 * @param {*} checkboxList array containing checkboxes info
 * @returns
 *		true, if the checkboxes are all unchecked
		false, if there is at least a checked checkbox.
 */

const	allUnchecked = (checkboxList) =>
{
	let	index;
	let	n;

	index = 0;
	n = 0;
	while (index < checkboxList.length)
	{
		if (checkboxList[index].checked === false)
			n++;
		index++;
	}
	if (n === index)
		return (true);
	return (false);
}

const	checkboxListener = (elements) =>
{
	let	checkboxList;

	checkboxSet(elements);
	checkboxList = [...document.getElementsByClassName("cb")];
	for (let checkbox of checkboxList)
	{
		checkbox.addEventListener("change", (event)=>
		{
			if (event.target.checked)
			{
				document.getElementById("done-btn").style.display = "block";
				document.getElementById("remove-btn").style.display = "block";
			}
			else if (allUnchecked(checkboxList) === true)
			{
				document.getElementById("done-btn").style.display = "none";
				document.getElementById("remove-btn").style.display = "none";
			}
		})
	}
}

//now it is not possible to delete task when there's only one.
const	removeTask = () =>
{
	const	div	= [...document.getElementsByTagName("div")];
	const	toDoObject = JSON.parse(localStorage.toDo);
	const	spliceArray = [];
	let		index = 0;
	let		n;

	
	for (let i = 0; i < div.length; i++)
	{
		if (div[i].childNodes[1].checked === true)
		{
			document.getElementById(`div${i}`).remove();
			spliceArray[index++] = i;
		}
	}
	n = spliceArray[index - 1];
	while (index > 0)
	{
		if (spliceArray[index - 1] === toDoObject[n].id)
		{
			toDoObject.splice(n, 1);
			index--;
		}
		n--;
	}
	console.log(n);
	console.log(spliceArray[index - 1]);
	console.log(toDoObject);
	console.log(div[0].childNodes[1].checked);
}

const	mainListener = async() =>
{
	let	elements = await listPopulate();

	if (!elements)
		return (0);
	console.log(elements);
	checkboxListener(elements);
	keyboardListener(elements);
	updateListener(elements);
}