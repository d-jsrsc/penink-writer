const { version } = require("../package.json");
const AdmZip = require("adm-zip");

const zip = new AdmZip();
zip.addLocalFolder("./build", "build");
zip.writeZip(`./release/${version}.zip`);
