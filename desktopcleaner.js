const fs = require('fs');
const path = require('path');
const os = require('os');
const mv = require('mv');

// Path to your desktop
let desktopPath;
if (os.platform() === 'win32') {
    // For Windows platform
    const userProfileFolder = process.env.USERPROFILE || '';
    desktopPath = path.join(userProfileFolder, 'Desktop');
} else {
    // For other Operating Systems (Linux and macOS)
    const homeDirectory = os.homedir();
    desktopPath = path.join(homeDirectory, 'Desktop');
}

// Designated folder for organized content        
const organizedDesktopPath = path.join(desktopPath, 'Organized Desktop');

// File type categories with their respective extensions
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
    Miscellaneous: [] // This will catch all other file types
};

// Files to exclude from being moved
const excludeFiles = [
    path.join(desktopPath, 'Desktop Cleaner', 'runDesktopCleaner.bat'),
    path.join(desktopPath, 'Clean Desktop.lnk')
];

// Ensure target directories exist
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

// Move files to corresponding directories
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

// Organize Desktop Files
function organizeDesktop() {
    fs.readdir(desktopPath, (err, files) => {
        if (err) {
            console.error('Could not read desktop directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(desktopPath, file);

            // Exclude specific files
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

                // Move to Miscellaneous if no category matched
                if (!moved) {
                    moveFile(filePath, 'Miscellaneous');
                }
            }
        });
    });
}

// Run the organization process
ensureDirectoriesExist();
organizeDesktop();
