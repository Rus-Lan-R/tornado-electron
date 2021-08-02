const electron = require("electron");
const url = require("url");
const path = require("path");
const { create } = require("domain");
var util = require("util");

const { app, BrowserWindow } = electron;

const PORT = 8888;
let server = null;

const PY_DIST_FOLDER = "pydist";
const PY_MODULE_NAME = "server";

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
	// if (!isPackaged()) server = cp.spawn("python", "server.py");

	console.log(script);

	if (!isPackaged()) server = cp.spawn("python3", [script, PORT]);
	else server = cp.execFile(script, [PORT]);

	util.log("readingin");

	process.stdout.on("data", function (chunk) {
		let textChunk = chunk.toString("utf8"); // buffer to string

		util.log(textChunk);
	});

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
			pathname: path.join(__dirname, "index.html"),
			protocol: "file",
			slashes: true,
		}),
	);

	createServer();
});

app.on("will-quit", () => {
	server.kill();
});
