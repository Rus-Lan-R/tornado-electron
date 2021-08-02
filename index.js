document.getElementById("getData").addEventListener("click", () => {
	fetch(`http://localhost:8888/getData`).then((res) =>
		res.json().then((response) => {
			fillItemList(response.data);

			fillDiv("data received");
		}),
	);
});

function fillDiv(item) {
	const div = document.getElementById("data");
	console.log(div);
	div.innerText = item;
}

function fillItemList(data) {
	const ul = document.getElementById("item-list");
	ul.innerHTML = "";
	console.log(data);
	for (let key in data) {
		let li = document.createElement("li");
		li.innerText = `${key} - ${data[key]}`;
		ul.appendChild(li);
	}
}
