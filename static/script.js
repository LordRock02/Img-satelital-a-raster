const dropArea = document.querySelector('.drop-section')
const listSection = document.querySelector('.list-section')
const listContainer = document.querySelector('.list')
const fileSelector = document.querySelector('.file-selector')
const fileSelectorInput = document.querySelector('.file-selector-input')
const imgForm = document.getElementById('subirImg')
const opcionColor = document.getElementById('opcionColor')

// upload files with browse button
var img = ''
fileSelector.onclick = () => fileSelectorInput.click()
fileSelectorInput.onchange = () => {
    const file = fileSelectorInput.files[0];
    uploadFile(file)
    if (file) {
        const formData = new FormData()
        formData.append('foto', file)
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('La imagen se ha cargado correctamente');
                return response.json()
            } else {
                throw new Error('Error al cargar la imagen:', response.statusText);
            }
        })
        .then(data => {
            img = data.filename
            console.log('Nombre de la imagen:', img)
        })
        .catch(error => {
            console.error('Error al cargar la imagen:', error);
        })
    }
}

opcionColor.addEventListener('change', function() {
    const selectedOption = opcionColor.value
    console.log('La opción seleccionada es: ', selectedOption, img)
    const formData = new FormData()
    formData.append('nombre', img)
    formData.append('color', selectedOption)
    fetch('/generate-raster', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if(response.ok){
            return response.json()
        }
    })
    .then(data => {
            console.log(data.name)
            document.getElementById('imgRaster').innerHTML=`<img src='static/uploads/${data.name}'/>`
    })
})

// when file is over the drag area
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if(typeValidation(item.type)){
            dropArea.classList.add('drag-over-effect')
        }
    })
}
// when file leave the drag area
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect')
}
// when file drop on the drag area
dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect')
    if(e.dataTransfer.items){
        [...e.dataTransfer.items].forEach((item) => {
            if(item.kind === 'file'){
                const file = item.getAsFile();
                if(typeValidation(file.type)){
                    uploadFile(file)
                }
            }
        })
    }else{
        [...e.dataTransfer.files].forEach((file) => {
            if(typeValidation(file.type)){
                uploadFile(file)
            }
        })
    }
}


// check the file type
function typeValidation(type){
    var splitType = type.split('/')[0]
    if(type == 'application/pdf' || splitType == 'image' || splitType == 'video'){
        return true
    }
}

// upload file function
function uploadFile(file){
    const existingLi = listContainer.querySelector('li');
    if (existingLi) {
        listContainer.removeChild(existingLi);
    }
    listSection.style.display = 'block'
    var li = document.createElement('li')
    li.classList.add('in-prog')
    li.innerHTML = `
        <div class="col">
            <img src="static/icons/${iconSelector(file.type)}" alt="">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name" id=''>${file.name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(file.size/(1024*1024)).toFixed(2)} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
        </div>
    `
    listContainer.prepend(li)
    li.classList.add('complete')
    li.classList.remove('in-prog')
}
// find icon for file
function iconSelector(type){
    var splitType = (type.split('/')[0] == 'application') ? type.split('/')[1] : type.split('/')[0];
    return splitType + '.png'
}