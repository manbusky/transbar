
const {app, ipcMain, globalShortcut, clipboard, Menu} = require('electron');

var menubar = require('menubar');
var Typo = require('typo-js');

var dictionary = new Typo("en_US");

var W_WIDTH = 480;
var W_HEIGHT = 45;
var W_ITEM_HEIGHT = 40;
// var W_HEIGHT = 200;

var mb = menubar({
	dir: __dirname,
	alwaysOnTop: false,
    width: W_WIDTH, 
    height: W_HEIGHT, 
    y: 120,
    preloadWindow: true
});

mb.on('ready', function ready () {

	console.log('app is ready！！！');

	const contextMenu = Menu.buildFromTemplate([
	    {label: 'Preferences', type: 'normal', click: MenuItemClickEventListener},
	    {type: 'separator'},
	    {label: 'Quit', type: 'normal', click: MenuItemClickEventListener}
	]);
	mb.tray.setToolTip('trans bar');
	mb.tray.setContextMenu(contextMenu);

	const ret = globalShortcut.register('CommandOrControl+Shift+M', () => {

    	console.log('CommandOrControl+M is pressed');

    	mb.showWindow();

	});

	if (!ret) {
		console.log('registration failed');
		return;
	}

	// Check whether a shortcut is registered.
	console.log(globalShortcut.isRegistered('CommandOrControl+Shift+M'));
});

mb.on('show', function () {

//	mb.window.openDevTools();
});

mb.on('after-create-window', function() {

	console.log("after-create-window");

	mb.window.on('show', () => {

		var clipboardText = clipboard.readText();

		if(dictionary.check(clipboardText)) {

			mb.window.webContents.send("clipboard-paste", clipboardText);
		}

		globalShortcut.register('Escape', () => {
			mb.hideWindow();
		});

	});

	mb.window.on('hide', () => {

		console.log("关闭了!");

		globalShortcut.unregister('Escape');
	});

});

function MenuItemClickEventListener(menuItem, browserWindow, event) {
	if(menuItem.label == 'Quit') {
		globalShortcut.unregisterAll();
		mb.app.quit();
	}
}

ipcMain.on('render-resize', (event, arg) => {

	var add = arg == 0 ? W_HEIGHT : (W_HEIGHT + W_ITEM_HEIGHT * arg + 75);

	mb.window.setSize(W_WIDTH, add);

	event.returnValue = arg;
})

