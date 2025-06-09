// Script per correggere tutti gli import problematici
import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix common import patterns
      content = content.replace(/from ["']@\/components\/ui\/([^"']+)["']/g, 'from "./ui/$1"');
      content = content.replace(/from ["']@\/hooks\/([^"']+)["']/g, 'from "../../hooks/$1"');
      content = content.replace(/from ["']@\/lib\/([^"']+)["']/g, 'from "../../lib/$1"');
      content = content.replace(/from ["']@\/pages\/([^"']+)["']/g, 'from "./pages/$1"');
      content = content.replace(/from ["']@\/components\/([^"']+)["']/g, 'from "./components/$1"');
      
      // Fix relative paths that are wrong
      if (filePath.includes('components/ui/')) {
        content = content.replace(/from ["']\.\.\/\.\.\/lib\/utils["']/g, 'from "../../lib/utils"');
        content = content.replace(/from ["']\.\/ui\/([^"']+)["']/g, 'from "./$1"');
      }
      
      if (filePath.includes('pages/')) {
        content = content.replace(/from ["']\.\/components\/([^"']+)["']/g, 'from "../components/$1"');
        content = content.replace(/from ["']\.\/pages\/([^"']+)["']/g, 'from "./$1"');
      }
      
      fs.writeFileSync(filePath, content);
    }
  });
}

// Fix imports in client/src
fixImports('./client/src');
console.log('Import fixes completed');