const jwt = require('jsonwebtoken');

const generateToken = (username,role) =>{
    return jwt.sign({username : username },"hfghsghghj")  
}

module.exports = {generateToken};