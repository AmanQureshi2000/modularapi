const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../models/Category');

getAll = async (req, res) => {
    const result = await getCategories();
    res.status(result.success === false ? 500 : 200).json(result);
};

getOne = async (req, res) => {
    const result = await getCategory(req.params.id);
    if (!result) return res.status(404).json({ error: 'Category not found' });
    res.status(result.success === false ? 500 : 200).json(result);
};

create = async (req, res) => {
    const result = await createCategory(req.body);
    res.status(result.success === false ? 400 : 201).json(result);
};

update = async (req, res) => {
    const result = await updateCategory(req.params.id, req.body);
    res.status(result.success === false ? 400 : 200).json(result);
};

remove = async (req, res) => {
    const result = await deleteCategory(req.params.id);
    res.status(result.success === false ? 500 : 200).json(result);
};

module.exports = { getAll, getOne, create, update, remove };