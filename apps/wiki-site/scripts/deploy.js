const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs-extra');

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAI5tHmaMVTXgF1cEApAscn',
  accessKeySecret: 'C5jzkDt51KzXd4CjnpbX7jQ63U7N5m',
  bucket: 'blog-jeiizou-site',
});

const headers = {
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard',
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': 'false',
};

async function put(remotePath, filePath) {
  try {
    const result = await client.put(remotePath, path.normalize(filePath), { headers });
    if (result.res.status === 200) {
      console.log(`[${remotePath}] upload success`);
    } else {
      console.error(result);
    }
  } catch (e) {
    console.log(e);
  }
}

const getSiteFile = (dirPath, fileList = []) => {
  let targetDir = fs.readdirSync(dirPath);
  for (let i = 0; i < targetDir.length; i++) {
    const filePath = targetDir[i];
    let newFilePath = path.join(dirPath, filePath);
    let stats = fs.statSync(newFilePath);
    if (stats.isDirectory()) {
      getSiteFile(newFilePath, fileList);
    } else {
      fileList.push(newFilePath);
    }
  }
};

function main() {
  let buildFileDir = path.join(__dirname, '../', 'build');
  let files = [];
  getSiteFile(buildFileDir, files);

  let filesObj = files.map((item) => ({
    remotePath: path.relative(buildFileDir, item),
    filePath: item,
  }));

  filesObj.forEach((fileObj) => {
    put(fileObj.remotePath, fileObj.filePath);
  });
}

main();
