import axios from '../axios';

const getAllCategories = async (searchQuery, id) => {
    try {
        const response = await axios.get('/api/get-all-categories', {
            params: {
                searchQuery: searchQuery,
                id: id
            }
        });
        return response;
    } catch (error) {
        console.error("Error in categoryService:", error);
        return null;
    }
};

const updateCategory = (data) => {
    return axios.put('/api/edit-categories', data);
};

const deleteCategory = (categoryId) => {
    axios.delete('/api/delete-categories', {
        data: { id: categoryId }
    });
};


const createCategory = (data) => {
    console.log('data form modal', data);
    return axios.post('/api/create-new-categories', data);
};


export {
    getAllCategories,
    updateCategory,
    deleteCategory,
    createCategory,
}
