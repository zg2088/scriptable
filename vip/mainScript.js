// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: cloud-download-alt;
async function main() {
  const bgColor = Color.dynamic(
    new Color('#F5F5F5'),
    new Color('#000000')
  );
  const Files = FileManager.iCloud();
  const RootPath = Files.documentsDirectory();
  
  const saveFileName = (fileName) => {
    const hasSuffix = fileName.lastIndexOf(".") + 1;
    return !hasSuffix ? `${fileName}.js` : fileName;
  };
  
  const write = (fileName, content) => {
    let file = saveFileName(fileName);
    const filePath = Files.joinPath(RootPath, file);
    Files.writeString(filePath, content);
    return true;
  };
  
  const saveFile = async ({ moduleName, url }) => {
    const req = new Request(encodeURI(url));
    const content = await req.loadString();
    write(`${moduleName}`, content);
    return true;
  };
  
  const notify = async (title, body, url, opts = {}) => {
    let n = new Notification();
    n = Object.assign(n, opts);
    n.title = title;
    n.body = body;
    if (url) n.openURL = url;
    return await n.schedule();
  };
  
  const renderTableList = async (data) => {
    try {
      const table = new UITable();
      table.showSeparators = true;
  
      const gifRow = new UITableRow();
      gifRow.height = 80 * Device.screenScale();
      const gifImage = gifRow.addImageAtURL(atob('aHR0cHM6Ly9zd2VpeGluZmlsZS5oaXNlbnNlLmNvbS9tZWRpYS9NMDAvNzEvQzgvQ2g0RnlXT0k2b0NBZjRQMUFFZ0trSzZxVVVrNTQyLmdpZg=='));
      gifImage.widthWeight = 0.4;
      gifImage.centerAligned();
      table.addRow(gifRow);
  
      // interval
      const gapRow1 = new UITableRow();
      gapRow1.height = 30;
      gapRow1.backgroundColor = bgColor
      table.addRow(gapRow1);
  
      // topRow
      const topRow = new UITableRow();
      topRow.height = 70;
      const leftText = topRow.addButton('示例图');
      leftText.widthWeight = 0.3;
      leftText.onTap = async () => {
        const webView = new WebView();
        await webView.loadURL(atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9mcmFtZXdvcmsvcmF3L21hc3Rlci9pbWcvcGljdHVyZS9FeGFtcGxlLnBuZw=='));
        await webView.present(false);
      };
  
      const authorImage = topRow.addImageAtURL('https://gitcode.net/4qiao/framework/raw/master/img/icon/4qiao.png');
      authorImage.widthWeight = 0.4;
      authorImage.centerAligned();
  
      const rightText = topRow.addButton('电报群');
      rightText.widthWeight = 0.3;
      rightText.rightAligned();
      rightText.onTap = async () => {
        await Safari.openInApp('https://t.me/+ViT7uEUrIUV0B_iy', false);
      };
      table.addRow(topRow);
  
      // interval
      const gapRow2 = new UITableRow();
      gapRow2.height = 30;
      gapRow2.backgroundColor = bgColor
      table.addRow(gapRow2);
  
      // 如果是节点，则先远程获取
      const req = new Request(data.subscription);
      const subscription = await req.loadJSON();
      const apps = subscription.apps;
      apps.forEach((item) => {
        const r = new UITableRow();
        r.height = 60;
        const imgCell = UITableCell.imageAtURL(item.thumb);
        imgCell.centerAligned();
        r.addCell(imgCell);
  
        const nameCell = UITableCell.text(item.title);
        nameCell.centerAligned();
        r.addCell(nameCell);
  
        const downloadCell = UITableCell.button("安装");
        downloadCell.centerAligned();
        downloadCell.dismissOnTap = true;
        downloadCell.onTap = async () => {
          if (item.depend) {
            try {
              for (let i = 0; i < item.depend.length; i++) {
                const relyItem = item.depend[i];
                const _isWrite = await saveFile({
                  moduleName: relyItem.name,
                  url: relyItem.scriptURL,
                });
                if (_isWrite) {
                  notify("下载提示", `依赖插件:${relyItem.name}下载/更新成功`);
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
          const isWrite = await saveFile({
            moduleName: item.name,
            url: item.scriptURL,
          });
          if (isWrite) {
            notify("下载提示", `小组件:${item.title}下载/更新成功`);
          }
        };
        r.addCell(downloadCell);
        table.addRow(r);
      });
  
      // bottom interval
      const bottom = new UITableRow();
      bottom.height = 225;
      bottom.backgroundColor = bgColor
      const bottomText = bottom.addText('Copyright © 2022 界面修改自·@DmYY');
      bottomText.widthWeight = 0.3;
      bottomText.centerAligned();
      bottomText.titleFont = Font.boldMonospacedSystemFont(12);
      bottomText.titleColor = Color.gray();
      table.addRow(bottom);
      table.present(false);
    } catch (e) {
      console.log(e);
      notify("错误提示", "订阅获取失败");
    }
  };
  
  const Run = async () => {
    try {
      // 默认订阅列表
      const defaultSubscribeList = [{
      author: '95度茅台',
      subscription: 'https://gitcode.net/4qiao/framework/raw/master/scriptable/install.json'
    }]
      const mainAlert = new Alert();
      mainAlert.title = "小组件下载";
      mainAlert.message = "可自行添加订阅地址";
      const cacheKey = "subscriptionList";
      const render = async () => {
        let subscriptionList = [];
        if (Keychain.contains(cacheKey)) {
          subscriptionList = JSON.parse(Keychain.get(cacheKey));
        }
        const _actions = [];
        console.log(subscriptionList);
        subscriptionList.forEach((item) => {
          const { author } = item;
          mainAlert.addAction(author);
          _actions.push(async () => {
            await renderTableList(item);
          });
        });
  
        _actions.push(async () => {
          const a = new Alert();
          a.title = "订阅地址";
          a.addTextField(
            "URL",
            "https://gitcode.net/4qiao/framework/raw/master/scriptable/install.json"
          );
          a.addAction("确定");
          a.addCancelAction("取消");
          const id = await a.presentAlert();
          if (id === -1) return;
          try {
            const url = a.textFieldValue(0);
            const response = await new Request(url).loadJSON();
            delete response.apps;
            const data = [];
            let isPush = true;
            for (let i in subscriptionList) {
              const item = subscriptionList[i];
              if (response.author === item.author) {
                isPush = false;
                data.push({ ...response, subscription: url });
              } else {
                data.push(item);
              }
            }
            if (isPush) data.push({ author: response.author, subscription: url });
            Keychain.set(cacheKey, JSON.stringify(data));
            notify("更新成功", "请重新运行本脚本");
          } catch (e) {
            console.log(e);
            notify("错误提示", "订阅地址错误，不是一个 JSON 格式");
          }
        });
        _actions.push(async () => {
          Keychain.set(cacheKey, JSON.stringify(defaultSubscribeList));
          await notify('小组件订阅', '订阅源重置成功');
          await Run();
      });
        // Main Menu
        mainAlert.addAction("添加订阅");
        mainAlert.addDestructiveAction("重置订阅");
        mainAlert.addCancelAction("取消操作");
        const _actionsIndex = await mainAlert.presentSheet();
        if (_actions[_actionsIndex]) {
          const func = _actions[_actionsIndex];
          await func();
        }
      };
      await render();
    } catch (e) {
      console.log("缓存读取错误" + e);
    }
  };
  
  (async () => {
    try {
      console.log("自动更新开始");
      const modules = {
        moduleName: "widget.Install",
        url:
          "https://gitcode.net/4qiao/scriptable/raw/master/api/installScript.js",
      };
      const result = await saveFile(modules);
      if (result) console.log("自动更新成功");
    } catch (e) {
      console.log(e);
    }
  })();
  
  await Run();
}
      
module.exports = {
  main
}