const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
await Promise.all(
    ['「小件件」广丰出行.js'].map(async (js) => {
        const REQ = new Request('https://api.ningkai.wang/scriptable-scripts/gtmc/gtmc.js');
        const RES = await REQ.load();
        FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), js), RES);
    })
);
FILE_MGR.remove(module.filename);
Safari.open(
    'scriptable:///open?scriptName=' + encodeURIComponent('「小件件」广丰出行')
);
  