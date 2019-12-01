class FileHandler {

    constructor() {
        if (FileHandler.__instance) {
            return FileHandler.__instance;
        }
        FileHandler.__instance = this;
    }

    setFileHandler(fileHandler) {
        this.fileHandler = fileHandler;
    }

    getFileHandler() {
        return this.fileHandler;
    }

    validateFileFormat(file) {
        return file.type.includes('text');
    }
}

async function openFileEvent() {
    const fileHandler = await window.chooseFileSystemEntries();
    const fileHandlerObject = new FileHandler();
    fileHandlerObject.setFileHandler(fileHandler);
    const file = await fileHandler.getFile();
    if (fileHandlerObject.validateFileFormat(file)) {
        const contents = await file.text();
        const textArea = document.querySelector('.input-area');
        textArea.value = contents;
    } else {
        alert('This is not a text file');
    }
}

function createEditFileBtnHandler() {
    const editButton = document.querySelector('.option-edit');
    editButton.addEventListener('click', openFileEvent);
}

function createSaveChangesBtnHandler() {
    const editButton = document.querySelector('.option-save');
    editButton.addEventListener('click', saveChangesEvent);
}

createEditFileBtnHandler();
createSaveChangesBtnHandler();


async function saveChangesEvent(fileHandle) {
    const fileHandlerObject = new FileHandler();
    const fileHandler = fileHandlerObject.getFileHandler();
    const writer = await fileHandler.createWriter();
    await writer.truncate(0);
    const textArea = document.querySelector('.input-area');
    await writer.write(0, textArea.value);
    await writer.close();
    textArea.value = "";
}