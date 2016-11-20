const {app, ipcMain, globalShortcut, clipboard, BrowserWindow, Menu, Tray} = require('electron');

var Typo = require('typo-js');
var Positioner = require('electron-positioner');
const storage = require('electron-json-storage');

var dictionary = new Typo("en_US");

var W_WIDTH = 480;
var W_HEIGHT = 45;
// var W_WIDTH = 800;
// var W_HEIGHT = 300;
var W_ITEM_HEIGHT = 40;

let tray = null;
let win = null;


app.on('ready', () => {
	console.log('app is ready！！！');

	app.dock.hide();

	//windows
	win = new BrowserWindow({
		width: W_WIDTH, 
		height: W_HEIGHT,
		resizable: false,
		frame: false,
		show: false
	});
	win.loadURL('file://' + __dirname + '/index.html');
	// win.webContents.openDevTools();
	loactionWindow();

	//tray
	tray = new Tray(__dirname + '/IconTemplate.png');
	var contextMenu = Menu.buildFromTemplate([
	    {label: 'Preferences', type: 'normal', click: MenuItemClickEventListener},
	    {label: 'Books', type: 'normal', click: MenuItemClickEventListener},
	    {type: 'separator'},
	    {label: 'Quit', type: 'normal', click: MenuItemClickEventListener}
	]);
	tray.setContextMenu(contextMenu);

	//shortcut
	const ret = globalShortcut.register('CommandOrControl+Shift+M', () => {

    	console.log('CommandOrControl+M is pressed');

    	win.show();
	});

	if (!ret) {
		console.log('registration failed');
		return;
	}

	// Check whether a shortcut is registered.
	console.log(globalShortcut.isRegistered('CommandOrControl+Shift+M'));


	win.on('show', () => {
		var clipboardText = clipboard.readText();

		if(dictionary.check(clipboardText)) {

			win.webContents.send("clipboard-paste", clipboardText);
		}

		globalShortcut.register('Escape', () => {
			win.hide();
		});

	});

	win.on('hide', () => {

		console.log("关闭了!");

		globalShortcut.unregister('Escape');
	});

	win.on('blur', () => {
		win.hide();
	});

});

function MenuItemClickEventListener(menuItem, browserWindow, event) {
	if(menuItem.label == 'Quit') {
		globalShortcut.unregisterAll();
		app.quit();

	} else if(menuItem.label == 'Books') {

		var dialog = new BrowserWindow({
			width: 480, 
			height: 600,
			resizable: false,
			// frame: false,
			show: true
		});
		dialog.loadURL('file://' + __dirname + '/dialog/index.html');
		// dialog.webContents.openDevTools();
		loactionWindow();

	}
}

ipcMain.on('render-resize', (event, arg) => {

	var add = arg == 0 ? W_HEIGHT : (W_HEIGHT + W_ITEM_HEIGHT * arg + 75);

	win.setSize(W_WIDTH, add);

	event.returnValue = arg;
})


function loactionWindow() {

	positioner = new Positioner(win);

	var position = positioner.calculate("topCenter");

	position.y += 120;

    win.setPosition(position.x, position.y);
}



