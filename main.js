const electron = require("electron");
const url = require("url");
const path = require("path");
const { create } = require("domain");

//Set env
process.env.NODE_ENV = "production";

const { app, BrowserWindow, Menu } = electron;

const PORT = 8888;
let server = null;

const PY_DIST_FOLDER = "pydist";
const PY_MODULE_NAME = "server";

//python server is packaged
const isPackaged = () => {
	const fullPath = path.join(__dirname, PY_DIST_FOLDER);
	return require("fs").existsSync(fullPath);
};

//get .py / .exe server path
const getScriptPath = () => {
	if (!isPackaged()) {
		return path.join(__dirname, PY_MODULE_NAME + ".py");
	}
	if (process.platform === "win32") {
		return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE_NAME, PY_MODULE_NAME + ".exe");
	}
	return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE_NAME, PY_MODULE_NAME);
};

//create server and setup logging
function createServer() {
	const script = getScriptPath();
	const cp = require("child_process");

	if (!isPackaged()) server = cp.spawn("python", [script, PORT]);
	else server = cp.execFile(script, [PORT]);

	server.stderr.on("error", (err) => {
		console.log("Server threw an error: " + err);
	});
	server.on("close", (code) => {
		console.log("Server exited with code " + code);
	});
}

let mainWindow;

app.on("ready", () => {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "mainWindow.html"),
			protocol: "file",
			slashes: true,
		}),
	);

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

	createServer();
});

app.on("will-quit", () => {
	server.kill();
});

//Define menu template
const mainMenuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "Quit",
				accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
				click() {
					app.quit();
				},
			},
		],
	},
];

//Add submenus for development
if (process.env.NODE_ENV !== "production") {
	mainMenuTemplate.push({
		label: "Dev Tools",
		submenu: [
			{
				label: "Toggle DevTools",
				accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				},
			},
			{
				role: "reload",
			},
		],
	});
}
