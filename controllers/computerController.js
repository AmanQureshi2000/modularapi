const {
    getComputers,
    getComputer,
    createComputer,
    updateComputer,
    deleteComputer
} = require('../models/Computer');

getAll = async (req, res) => {
    const result = await getComputers();
    res.status(result.success === false ? 500 : 200).json(result);
};

getOne = async (req, res) => {
    const result = await getComputer(req.params.id);
    if (!result) return res.status(404).json({ error: 'Computer not found' });
    res.status(result.success === false ? 500 : 200).json(result);
};

create = async (req, res) => {
    const result = await createComputer(req.body);
    res.status(result.success === false ? 400 : 201).json(result);
};

update = async (req, res) => {
    const result = await updateComputer(req.params.id, req.body);
    res.status(result.success === false ? 400 : 200).json(result);
};

remove = async (req, res) => {
    const result = await deleteComputer(req.params.id);
    res.status(result.success === false ? 500 : 200).json(result);
};

module.exports = { getAll, getOne, create, update, remove };