const jwt = ("jsonwebtoken");
const AppError = require("../errors/appError");

const authenticate = (roles) => {
    return function (req, res, next) {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return next(new AppError("Necesitas iniciar sesión", 403))
        }
        const token = authHeader.split(" ")[1];
        try{
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if(roles.includes(decodedToken.role)){
                req.userData = { userId: decodedToken.userId};
                next();
            } else {
                return next(new AppError("Usted no posee el rol necesario para hacer esta acción", 403));
            }
        } catch(error) {
           return next(new AppError("Permiso denegado", 403));
        }
    };
};

module.exports = authenticate;