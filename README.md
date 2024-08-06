# Desktop Organizer Script

This script organizes your desktop by moving files into categorized folders based on their file types, such as Documents, Images, Videos, and more. 

## How It Works
1. **Identifies Desktop Path**: Determines the desktop path based on the operating system.
2. **Defines File Categories**: Sets up categories for various file types (e.g., Documents, Images, Videos).
3. **Ensures Directories Exist**: Creates necessary directories within an "Organized Desktop" folder if they do not already exist.
4. **Reads and Moves Files**: Scans all files on the desktop, excluding specified files, and moves them into the appropriate directories based on their extensions.
5. **Handles Miscellaneous Files**: Files that do not match any predefined category are moved to a "Miscellaneous" folder.

By running this script, your desktop will be neatly organized, with files systematically arranged into relevant folders.



Here are step-by-step instructions for deploying and using the provided Node.js script on a Windows system:

### Prerequisites

1. **Node.js and npm**: Ensure Node.js and npm are installed on your system. You can download and install them from the [Node.js official website](https://nodejs.org/).

### Step 1: Create the Project Directory

1. Open a terminal (Command Prompt or PowerShell) and navigate to the directory where you want to create your project.
2. Create a new directory for your project and navigate into it:
   ```sh
   mkdir DesktopOrganizer
   cd DesktopOrganizer
   ```

### Step 2: Initialize a New Node.js Project

1. Initialize a new Node.js project by running:
   ```sh
   npm init -y
   ```

### Step 3: Install Required Dependencies

1. Install the necessary dependencies, specifically the `mv` package:
   ```sh
   npm install mv
   ```

### Step 4: Create the Script File

1. Create a new JavaScript file for the script. You can use a text editor or directly from the terminal:
   ```sh
   notepad index.js
   ```

2. Copy and paste the provided script into the `index.js` file:
   ```javascript
   const fs = require('fs');
   const path = require('path');
   const os = require('os');
   const mv = require('mv');

   let desktopPath;
   if (os.platform() === 'win32') {
       const userProfileFolder = process.env.USERPROFILE || '';
       desktopPath = path.join(userProfileFolder, 'Desktop');
   } else {
       const homeDirectory = os.homedir();
       desktopPath = path.join(homeDirectory, 'Desktop');
   }

   const organizedDesktopPath = path.join(desktopPath, 'Organized Desktop');

   const fileTypes = {
       Documents: ['pdf', 'docx', 'txt', 'rtf'],
       Images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
       Videos: ['mp4', 'mov', 'avi', 'mkv'],
       Apps: ['exe', 'msi', 'lnk'],
       Sheets: ['xls', 'xlsx', 'csv', 'xml'],
       Sounds: ['mp3', 'wav', 'ogg', 'flac'],
       Scripts: ['py', 'js', 'sh', 'bat'],
       Models: ['fbx', 'obj', 'blend', 'stl'],
       Archives: ['zip', 'rar', '7z', 'tar', 'gz'],
       Miscellaneous: []
   };

   const excludeFiles = [
       path.join(desktopPath, 'Desktop Cleaner', 'runDesktopCleaner.bat'),
       path.join(desktopPath, 'Clean Desktop.lnk')
   ];

   function ensureDirectoriesExist() {
       if (!fs.existsSync(organizedDesktopPath)) {
           fs.mkdirSync(organizedDesktopPath);
       }

       for (const category in fileTypes) {
           const dirPath = path.join(organizedDesktopPath, category);
           if (!fs.existsSync(dirPath)) {
               fs.mkdirSync(dirPath);
           }
       }
   }

   function moveFile(filePath, category) {
       const fileName = path.basename(filePath);
       const destPath = path.join(organizedDesktopPath, category, fileName);

       mv(filePath, destPath, { mkdirp: true }, function (err) {
           if (err) {
               console.error(`Could not move file ${fileName}:`, err);
           } else {
               console.log(`Moved file ${fileName} to ${category}`);
           }
       });
   }

   function organizeDesktop() {
       fs.readdir(desktopPath, (err, files) => {
           if (err) {
               console.error('Could not read desktop directory:', err);
               return;
           }

           files.forEach(file => {
               const filePath = path.join(desktopPath, file);

               if (excludeFiles.includes(filePath)) {
                   console.log(`Skipping file: ${filePath}`);
                   return;
               }

               const fileStat = fs.statSync(filePath);

               if (fileStat.isFile()) {
                   const fileExt = path.extname(file).slice(1).toLowerCase();
                   let moved = false;

                   for (const category in fileTypes) {
                       if (fileTypes[category].includes(fileExt)) {
                           moveFile(filePath, category);
                           moved = true;
                           break;
                       }
                   }

                   if (!moved) {
                       moveFile(filePath, 'Miscellaneous');
                   }
               }
           });
       });
   }

   ensureDirectoriesExist();
   organizeDesktop();
   ```

### Step 5: Run the Script

1. Ensure you are in the project directory where `index.js` is located.
2. Run the script using Node.js:
   ```sh
   node index.js
   ```

### Explanation

- **Script Overview**:
  - The script identifies the user's desktop path based on the operating system.
  - It defines categories for organizing files by their extensions.
  - It ensures the target directories exist.
  - It reads the files on the desktop and moves them into corresponding directories based on their file types.

- **Customization**:
  - You can add or remove file extensions in the `fileTypes` object to suit your needs.
  - You can modify the `excludeFiles` array to add files you don't want to move.

By following these steps, you will have deployed and executed the script to organize files on your Windows desktop.
