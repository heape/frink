const { app, session, net, shell, ipcMain, BrowserWindow } = require('electron')
var path = require('path')

let mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {

    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({
        width: 1200, height: 720,
        minWidth: 1200, minHeight: 720,
        maxWidth: 1426, maxHeight: 860,
        transparent: true,
        resizable: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.setMenu(null);
    mainWindow.setResizable(true);
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL('file://' + __dirname + '/src/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    })
    ipcMain.on('window-close', function (event, args) {
        mainWindow.close();
    })
    var pre_size = [];
    ipcMain.on('window-maximize', function (event, args) {
        var size = mainWindow.getSize();

        if (size[0] === 1426 && size[1] === 960) {
            mainWindow.setSize(pre_size[0], pre_size[1])
            return;
        } else {
            pre_size = size;
        }
        mainWindow.setSize(1426, 960)
        return;
        if (mainWindow.isMaximized())
            mainWindow.restore()
        else
            mainWindow.maximize()
    })
    ipcMain.on('window-minimize', function (event, args) {
        mainWindow.minimize();
    })
    ipcMain.on('getRakutenCookieFromWebview', function (event, args) {
        // Query all cookies associated with a specific url.
        session.defaultSession.cookies.get({ 'domain': '.rakuten.co.jp' }, (error, cookies) => {
            var ck = '';
            cookies.forEach((v, i) => {
                var name = v.name;
                var value = v.value;

                ck += name +'='+value +'; ';
            });

            if(ck != '')
                ck = ck.substr(0,ck.length -2);

            event.sender.send('rakutenCookieFromWebview', ck);
        });        
    });

    mainWindow.webContents.on('new-window', function (e, url) {
        //e = ""; ↓の方が行儀が良いっぽい
        e.preventDefault();
        shell.openExternal(url);
    })

    /*
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        if(details.url.includes('api.premium.rakuten.co.jp/v1.0/isMember?callback=&serviceId=2')) {
                    console.log(details.requestHeaders);
        }

        callback({
            cancel: false,
        });
    });
    */
});