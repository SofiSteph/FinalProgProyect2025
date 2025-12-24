const multer = require('multer');
const path= require('path');

//1- Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //la carpeta donde se guardarán las imágenes
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        //Crear un nombre del archivo único para evitar conflictos
        const uniqueSurfix = Date.now() + "-" + path.extname(file.originalname);
        cb(null, file.fieldname  + "-" +  uniqueSurfix);
    }
});

//filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;
  const mimetypeOk = allowedTypes.test(file.mimetype);
  const extnameOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetypeOk && extnameOk) {
    return cb(null, true);
  }

  const err = new Error('El tipo de archivo no está permitido');
  err.statusCode = 400;
  return cb(err);
};

//Inicialización de multer
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 + 5}, //límite de 5 mb
    fileFilter: fileFilter
})

module.exports = upload;