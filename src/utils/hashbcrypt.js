import bcrypt from "bcrypt";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isvalidPassword = (password, hash) => bcrypt.compareSync(password, hash);

export { createHash, isvalidPassword };