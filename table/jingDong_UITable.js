// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: tags;
/**
 * 小组件作者：95度茅台
 * UITable 版本: Version 1.0.0
 * 2023-02-27 11:30
 * Telegram 交流群 https://t.me/+ViT7uEUrIUV0B_iy
 */

async function main() {
  const uri = Script.name();
  const F_MGR = FileManager.local();
  const folder = F_MGR.joinPath(F_MGR.documentsDirectory(), "95duJingDong");
  const cacheFile = F_MGR.joinPath(folder, 'setting.json');
  const bgPath = F_MGR.joinPath(F_MGR.documentsDirectory(), "95duBackground");
  const bgImage = F_MGR.joinPath(bgPath, uri + ".jpg");
  
  if (F_MGR.fileExists(cacheFile)) {
    data = F_MGR.readString(cacheFile);
    setting = JSON.parse(data);
    cookie = setting.cookie;
    index = setting.randomIndex;
  }
  
  const stackSize = new Size(0, 64);
  const stackBackground = Color.dynamic(
    new Color('#EFEBE9', Number(setting.light)),
    new Color('#161D2A', Number(setting.dark))
  );
  const textColor = Color.dynamic(
    new Color('#1E1E1E'),
    new Color('#FEFEFE')
  );
  const jNumColor = Color.dynamic(
    new Color('#FF0000'),
    new Color('#FFBF00')
  );
  
  const notify = async (title, body, url) => {
    let n = new Notification();
    n.title = title
    n.body = body
    n.sound = 'alert'
    if (url) {n.openURL = url}
    return await n.schedule();
  }
  
  // User Information
  const info = await getJson('https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2');
  // signBean & Notification
  const signBean = await signBeanAct('https://api.m.jd.com/client.action?functionId=signBeanAct&body=%7B%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22referUrl%22%3A%22-1%22%2C%22userAgent%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22rnVersion%22%3A%223.9%22%7D&appid=ld');
  if (signBean.status === '1') {
    notify(`${signBean.continuityAward.title}${signBean.continuityAward.beanAward.beanCount}京豆，当前京豆${signBean.totalUserBean}`, `已签到${signBean.continuousDays}天，明天签到加${signBean.tomorrowSendBeans}京豆`)
  }
  
  // randomIndex
  if (index === 0) {
    const asset = await totalAsset('https://ms.jr.jd.com/gw/generic/bt/h5/m/firstScreenNew');
    setting.randomIndex = 1;
    val = {
      leading: 3,
      imageSize: 48,
      spac: 10,
      logoImage: 'http://mtw.so/67mqz3',
      text1: `额度 ${Math.round(asset.quota.quotaLeft.replace(',', ''))}`,
      text2: `待还 ${asset.bill.amount}`,  
      color: new Color.red();
    }
  } else if (index === 1) {
    const df = new DateFormatter();
df.dateFormat = 'yyyyMMddHHmmssSSS'
    const seventeen = df.string(new Date());
    const sendBean = await splitBeans(`https://api.m.jd.com/client.action?functionId=plantBeanIndex&appid=signed_wh5&body=%7B%22monitor_source%22%3A%22plant_m_plant_index%22%2C%22monitor_refer%22%3A%22%22%2C%22version%22%3A%229.2.4.2%22%7D&h5st=${seventeen}%3B1811576433289285%3Bd246a%3Btk02w9ca81c1118n02isGDQ1pUhP9nwAtUQLeseYBxpBC1AbHd0KLKWxfQscxLmZ6Nv2p5%2BUPBPtcFGbsllDiD11qpWg%3B0fb0513f732c6d3eaeda15a15e512e302bbc829a598d270eb641b63c104582e4%3B3.1%3B1677608091130%3B7414c4e56278580a133b60b72a30beb2764d2e61c66a5620e8e838e06644d1bf76a78f278d7cc94670cbd432044eb06a77095e37140112b5a17b40b38d068743aa0853058d2ea75e3128f8593a2099fd3bfa9bcfa5390129202e52e8e16b29d2900ae1acd3c87e40f86323d92a5c4f539528eab8cc981fbaf031ba1cd64e0b61c68d4aaf29f2858c61c41da4c5fb52e4`);
    setting.randomIndex = 2;
    val = {
      leading: -3,
      imageSize: 42,
      spac: 1,
      logoImage: 'http://mtw.so/5ZaG1N',
      text1: sendBean.splitBeans,
      text2: `豆苗成长值 ${sendBean.growth}`,  
      color: new Color.green();
    }
  } else if (index === 2) {
    const redEnvelope = await redPackage('https://wq.jd.com/user/info/QueryUserRedEnvelopesV2?type=1&orgFlag=JD_PinGou_New&page=1&cashRedType=1&redBalanceFlag=1&channel=3&sceneval=2&g_login_type=1');
    setting.randomIndex = 3;
    val = {
      leading: -3,
      imageSize: 42,
      spac: 1,
      logoImage: 'http://mtw.so/5ZaunR',
      text1: `红包 ${redEnvelope.balance}`,
      text2: `即将过期 ${redEnvelope.expiredBalance}`,  
      color: new Color.orange();
    }
  } else if (index === 3) {
    const farm = await farmProgress('https://api.m.jd.com/client.action?functionId=initForFarm');  
    if (farm.treeState == 2 || farm.treeState == 3) {
      notify('东东农场', `${farm.name}，可以兑换啦~`);  
    }
    setting.randomIndex = 0;
    val = {
      leading: 5,
      imageSize: 35,
      spac: 5,
      logoImage: 'https://gitcode.net/enoyee/scriptable/raw/master/img/jd/icon_fruit.png',
      text1: `已种植『 ${farm.simpleName} 』`,
      text2: '果树进度 ' + Math.floor((farm.treeEnergy / farm.treeTotalEnergy) * 100) + '%',  
      color: new Color.green();
    }
  }
  
  widget = await createWidget();
  await widget.presentSmall();
  
  async function createWidget() {
    const widget = new ListWidget();
    if (F_MGR.fileExists(bgImage)) {
      widget.backgroundImage = await shadowImage(F_MGR.readImage(bgImage))
    } else {
      widget.backgroundColor = Color.dynamic(new Color('#967969'), new Color('#555555'));
    }
    
    /**
    * Frame Layout
    * @param {image} image
    * @param {string} text
    */
    widget.setPadding(0, 0, 0, 0);
    const topStack = widget.addStack();
    topStack.setPadding(10, 3, 10, 3)
    topStack.layoutHorizontally();
    topStack.centerAlignContent();
    topStack.addSpacer();
    topStack.backgroundColor = stackBackground;
    topStack.cornerRadius = 23;
    topStack.size = stackSize;
    
    // User icon
    const iconStack = topStack.addStack();
    const headImage = await getImage(info.headImageUrl);
    const imageElement = iconStack.addImage(headImage);
    imageElement.imageSize = new Size(45, 45);
    iconStack.cornerRadius = Number(setting.radian);
    iconStack.borderWidth = 2;
    iconStack.borderColor = new Color('#FFBF00');
    topStack.addSpacer(10);
    
    // Nickname
    const nameStack = topStack.addStack();
    nameStack.layoutVertically();
    nameStack.centerAlignContent();
    const nicknameText = nameStack.addText(info.nickname);
    nicknameText.font = Font.boldSystemFont(15);
    nicknameText.textColor = textColor;
    nicknameText.textOpacity = 0.8
    nameStack.addSpacer(2);
    
    const jdNumStack = nameStack.addStack();
    jdNumStack.layoutHorizontally();
    jdNumStack.centerAlignContent();
    // http://mtw.so/67lqbD
    const jdou = await getImage('http://mtw.so/67lqbD');
    const jdouIcon = jdNumStack.addImage(jdou);
    jdouIcon.imageSize = new Size(18, 18);
    jdNumStack.addSpacer(3);
    const contentText = jdNumStack.addText(info.jdNum.toString());
    contentText.font = Font.boldSystemFont(16);
    contentText.textColor = jNumColor
    contentText.textOpacity = 0.7;
    topStack.addSpacer();
    widget.addSpacer(5);
    
    const middleStack = widget.addStack();
    middleStack.addSpacer();
    const middleText = middleStack.addText(`京享值 ${info.jvalue.toString()}`);
    middleText.textColor = Color.white();
    middleText.textOpacity = 0.9
    middleText.font = Font.boldSystemFont(11);
    middleStack.addSpacer();
    widget.addSpacer();
    
    /** 
    * Bottom Content
    * @param {image} image
    * @param {string} jvalue
    */
    const contentStack = widget.addStack();
    contentStack.layoutHorizontally()
    contentStack.centerAlignContent()
    contentStack.addSpacer();
    contentStack.backgroundColor = stackBackground
    contentStack.setPadding(10, val.leading, 10, 3);
    contentStack.cornerRadius = 23;
    contentStack.size = stackSize;
    // Logo
    const logoStack = contentStack.addStack();
    const logoImage = await getImage(val.logoImage);
    const logoIcon = logoStack.addImage(logoImage);
    logoIcon.imageSize = new Size(val.imageSize, val.imageSize);
    contentStack.addSpacer(val.spac);
    
    const threeStack = contentStack.addStack();
    threeStack.layoutVertically();
    threeStack.centerAlignContent();
    
    const randomText1 = threeStack.addText(val.text1);
    randomText1.textColor = textColor;
    randomText1.font = Font.boldSystemFont(13);
    randomText1.textOpacity = 0.8;
    threeStack.addSpacer(2.5);
  
    const randomText2 = threeStack.addText(val.text2);
    randomText2.textColor = val.Color;
    randomText2.font = Font.boldSystemFont(13);
    randomText2.textOpacity = 0.8;
    contentStack.addSpacer();
      
    F_MGR.writeString(cacheFile, JSON.stringify(setting));
    Script.setWidget(widget);
    Script.complete();
    return widget;
  }
  
  async function downloadModule() {
    const modulePath = F_MGR.joinPath(folder, 'image.js');
    if (F_MGR.fileExists(modulePath)) {
      return modulePath;
    } else {
      const req = new Request(atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9zY3JpcHRhYmxlL3Jhdy9tYXN0ZXIvdmlwL21haW5UYWJsZUJhY2tncm91bmQuanM='));
      const moduleJs = await req.load().catch(() => {
        return null;
      });
      if (moduleJs) {
        F_MGR.write(modulePath, moduleJs);
        return modulePath;
      }
    }
  }
  
  async function getImage(url) {
    const r = await new Request(url);
    return await r.loadImage();
  }
  
  async function shadowImage(img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    ctx.setFillColor(new Color("#000000", Number(setting.masking)));
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    return await ctx.getImage()
  }
  
  async function signBeanAct(url) {
    const req = new Request(url)
    req.method = 'POST'
    req.headers = {
      Referer: 'https://h5.m.jd.com/',
      Cookie: cookie
    }
    const res = await req.loadJSON();
    return res.data
  }
    
  async function getJson(url) {
    const req = new Request(url)
    req.method = 'POST'
    req.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
      Cookie: cookie
    }
    const res = await req.loadJSON();
    return res.base;
  }
  
  async function totalAsset(url) {
    const request = new Request(url);
    request.method = 'POST'
    request.headers = {
      Referer: "https://mallwallet.jd.com/",
      Cookie: cookie
    }
    request.body = `reqData={
      "clientType": "ios"
    }`
    const res = await request.loadJSON();
    return res.resultData.data
  }
  
  async function splitBeans(url) {
    const req = new Request(url)
    req.method = 'GET'
    req.headers = {
      Referer: 'https://plantearth.m.jd.com/',
      Cookie: cookie
    }
    const res = await req.loadJSON();
    return res.data.roundList[1];
  }
  
  async function redPackage(url) {
    const req = new Request(url)
    req.method = 'GET'
    req.headers = {
      Referer: 'https://plantearth.m.jd.com/',
      Cookie: cookie
    }
    const res = await req.loadJSON();
    return res.data;
  }
  
  async function farmProgress(url) {
    const req = new Request(url)
    req.method = 'POST'
    req.headers = {
      Referer: 'https://h5.m.jd.com/',  
      Cookie: cookie
    }
    req.body = 'body=version:4&appid=wh5&clientVersion=9.1.0'
    const res = await req.loadJSON();
    const { farmUserPro } = res;
    const { treeState, name, treeTotalEnergy, treeEnergy, simpleName } = farmUserPro;
    return farmUserPro;
  }
}
module.exports = { main }