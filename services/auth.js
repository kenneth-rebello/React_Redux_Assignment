const bcrypt = require('bcryptjs');

const getPasswordHash = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const matchPassword = async(password1, password2) => {
    const isMatch = await bcrypt.compare(password1, password2);
    return isMatch;
}

module.exports = {
    getPasswordHash,
    matchPassword
}