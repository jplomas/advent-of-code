const fs = require('fs');

let tree = [];
let buf = [];
let depth = 0;
let maxDepth = 0;
let location = '/';

function cd(dir) {
  if (dir === '..') {
    depth -= 1;
    location = location.substring(0, location.lastIndexOf('/'));
  } else {
    depth +=1;
    if (location !== '/') {
      location = `${location}/${dir}`;
    } else {
      if (dir !== '/') {
        location = `/${dir}`;
      }
    }
  }
  if (location === '') {
    location = '/';
  }
  if (depth > maxDepth) {
    maxDepth = depth;
  }
}

function parseCommand(cmd) {
  if (cmd.slice(2,4) === 'cd') {
    cd(cmd.slice(5, cmd.length));
  }
}

function buildObject(buffer) {
  let output = [];
  buffer.forEach(element => {
    const input = element.split(' ');
    let type = 'file';
    let size = null;
    if (input[0] === 'dir') {
      type = 'dir';
      size = 0;
    } else {
      size = parseInt(input[0]);
    }
    output.push({name: input[1], type, size });
  });
  return output;
}

async function parseBuffer() {
  const obj = {};
  obj.contents = buildObject(buf);
  obj.location = location;
  obj.depth = depth;
  tree.push(obj);
  buf = [];
  return null;
}

async function folderSize(loc) {
  let fsTotal = 0;
  for (let fSloop = 0; fSloop < tree.length; fSloop++) {
    if (tree[fSloop].location === loc) {
      for (let c = 0; c < tree[fSloop].contents.length; c++) {
        if (tree[fSloop].contents[c].type === 'dir') {
          if (tree[fSloop].location === '/') {
            fsTotal += await folderSize(`/${tree[fSloop].contents[c].name}`);
          } else {
            fsTotal += await folderSize(`${tree[fSloop].location}/${tree[fSloop].contents[c].name}`);
          }
        } else {
          fsTotal += tree[fSloop].contents[c].size;
        }
      }
      return fsTotal;
    }
  }
}

async function DODirs() {
  for (let t = maxDepth + 1; t > -1; t--) {
    for (let master = 0; master < tree.length; master++) {
      if (tree[master].depth === t) {
        for (let c = 0; c < tree[master].contents.length; c++) {
          if (tree[master].contents[c].type === 'dir') {
            if (tree[master].location === '/') {
              tree[master].contents[c].size = await folderSize(`/${tree[master].contents[c].name}`);
            } else {
              tree[master].contents[c].size = await folderSize(`${tree[master].location}/${tree[master].contents[c].name}`);
            }
          }
        }
      }
    }
  }
  return true;
}

async function sumSizes() {
  for (let master = 0; master < tree.length; master++) {
    let total = 0;
    for (let c = 0; c < tree[master].contents.length; c++) {
      total += tree[master].contents[c].size;
    }
    tree[master].total = total;
  }
  return true;
}

function getDirSize(input) {
  for (let master = 0; master < tree.length; master++) {
    if (tree[master].location === input) {
      return tree[master].total;
    }
  }
  throw new Error('No such directory');
}

function checkDelete(dir) {
  const s = getDirSize(dir);
  const needed = 30000000;
  const df = 70000000 - getDirSize('/') + s;
  if (df >= needed) {
    return true;
  } else {
    return false;
  }
}

async function main() {
  fs.readFile('input.txt', async (err, data) => {
    if (err) throw err;
    const input = data.toString().split('\n');
    input.forEach((std, index) => {
    // console.log(std);
      if (std[0] === '$') {
        if ((index > 0 && buf.length > 0) || index === input.length) {
          parseBuffer();
        }
        parseCommand(std);
      } else {
        buf.push(std);
      }
    });
    parseBuffer();
    DODirs().then(async () => {
      await sumSizes();
      console.log('=====FINAL TREE =====');
      console.dir(tree, { depth: null });
      console.log(`Folder size of / ${getDirSize('/')}`);
      let sum = 0;
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].total <= 100000 && tree[i].location !== '/') {
          sum += tree[i].total;
        }
      }
      console.log(`Sum of dirs with total size of at most 100000: ${sum}`);
      let smallestToDelete = getDirSize('/');
      for (let i = 0; i < tree.length; i++) {
        if (checkDelete(tree[i].location)) {
          const s = getDirSize(tree[i].location);
          if (s < smallestToDelete) {
            smallestToDelete = s;
          }
        };
      }
      console.log(`Smallest file to delete has size ${smallestToDelete}`);
    });
  });
}

main();
