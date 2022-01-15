import DatauriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DatauriParser();

const format64 = (file) => parser.format(path.extname(file.originalname).toString(), file.buffer);

export default format64;
