
const {app, ipcMain, globalShortcut} = require('electron');

var menubar = require('menubar');

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
    preloadWindow: false
});

mb.on('ready', function ready () {
	console.log('app is ready');

	globalShortcut.register('Escape', () => {

		mb.hideWindow();
	});

	const ret = globalShortcut.register('CommandOrControl+Shift+Space', () => {

    	console.log('CommandOrControl+X is pressed');

    	mb.showWindow();

	});

	  if (!ret) {
	    console.log('registration failed');
	    return;
	  }

	  // Check whether a shortcut is registered.
	  console.log(globalShortcut.isRegistered('CommandOrControl+Shift+Space'));
});

mb.on('show', function () {


});

mb.on('after-create-window', function() {

	console.log("after-create-window");

	// mb.window.openDevTools();

	mb.window.on('hide', () => {
		console.log("关闭了!");
	});

});

ipcMain.on('render-resize', (event, arg) => {

	var add = arg == 0 ? W_HEIGHT : (W_HEIGHT + W_ITEM_HEIGHT * arg + 75);

	mb.window.setSize(W_WIDTH, add);

	event.returnValue = arg;
})

