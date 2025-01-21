import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { debounce, flatMap, startCase } from 'lodash';
import { CommonUtils } from '../../utils';



// Điều hướng
import StaffNavigator from '../../components/StaffNavigator';

// Header
import { adminMenu } from '../Header/menuApp';

// SCSS
import './CategoryManage.scss';

//Api
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../../services/categoryService';

//modal
import ModalAddCategory from './ModalAddCategory';
import ModalEditCategory from './ModalEditCategory';
import { emitter } from '../../utils/emitter';




class CategoryManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            searchQuery: '',
            isOpenAddModal: false,
            isOpenEditModal: false,
            selectedCategory: null,
        };
    }

    async componentDidMount() {
        await this.getAllCategories();
    }


    // Lấy danh sách tất cả các danh mục (hỗ trợ tìm kiếm)
    // getAllCategories = async () => {
    //     try {
    //         let response = await getAllCategories(this.state.searchQuery);
    //         if (response && response.errCode === 0) {
    //             this.setState({
    //                 categories: response.categories
    //             });
    //         } else {
    //             console.error('Error:', response.errMessage);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //     }
    // };

    // getAllCategories = async () => {
    //     try {
    //         let response = await getAllCategories(this.state.searchQuery);
    //         if (response && response.errCode === 0) {
    //             let categories = response.categories.map(category => {
    //                 let imageBase64 = '';

    //                 if (category.imageUrl && category.imageUrl.data) {
    //                     imageBase64 = new Buffer.from(category.imageUrl.data, 'base64').toString();
    //                 }

    //                 return {
    //                     ...category,
    //                     previewImageUrl: category.imageUrl ? `data:image/jpeg;base64,${imageBase64}` : null
    //                 };
    //             });

    //             this.setState({ categories });
    //         } else {
    //             console.error('Error:', response.errMessage);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //     }
    // };

    getAllCategories = async () => {
        try {
            let response = await getAllCategories(this.state.searchQuery);
            if (response && response.errCode === 0) {
                let categories = response.categories.map(category => {
                    let imageBase64 = '';
                    if (category.imageUrl && category.imageUrl.data) {
                        imageBase64 = Buffer.from(category.imageUrl.data, 'base64').toString('utf-8'); // Đổi từ 'binary' thành 'base64'

                        console.log("Category Image Base64:", imageBase64); // Kiểm tra
                    }
                    const previewImageUrl = imageBase64;
                    // console.log("previewImageUrl:", previewImageUrl); // Kiểm tra
                    return {
                        ...category,
                        previewImageUrl
                    };
                });

                console.log("API Response:", response.categories); // Kiểm tra phản hồi từ API

                this.setState({ categories });
            } else {
                console.error('Error:', response.errMessage);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };









    // Xóa danh mục


    handleDeleteCategory = async (categoryId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this category?');
        if (isConfirmed) {
            try {
                let response = await deleteCategory(categoryId);
                if (response && response.errCode === 0) {
                    // Cập nhật lại trạng thái categories để loại bỏ danh mục đã xóa
                    this.setState((prevState) => ({
                        categories: prevState.categories.filter(category => category.id !== categoryId)
                    }));

                    // Nếu muốn chắc chắn rằng các danh mục luôn được cập nhật từ server
                    // await this.getAllCategories();

                    alert(response.errMessage);
                } else {
                    console.error('Error:', response.errMessage);
                    alert(response ? response.errMessage : 'Unknown error');
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };


    // Xử lý tìm kiếm danh mục
    handleSearch = debounce(async (e) => {
        const searchQuery = e.target.value.trim();
        console.log("Search Query:", searchQuery); // Kiểm tra giá trị nhập vào

        this.setState({ searchQuery });
        await this.getAllCategories(searchQuery);
    }, 500);


    // Mở modal tạo danh mục mới
    toggleModal = () => {
        console.log("Toggling Add Modal:", !this.state.isOpenAddModal); // Kiểm tra log để xác nhận trạng thái
        this.setState(prevState => ({
            isOpenAddModal: !prevState.isOpenAddModal
        }));
    };



    toggleEditModal = (category) => {
        console.log("Toggling Edit Modal for category:", category);
        this.setState({
            isOpenEditModal: !this.state.isOpenEditModal,
            selectedCategory: category
        });
    };


    handleAddNewCategory = () => {
        this.toggleModal();

    }

    // Tạo danh mục mới
    createNewCategory = async (data) => {
        try {
            console.log('Data from modal:', data);  // Log dữ liệu trước khi gửi

            let response = await createCategory(data);
            if (response && response.errCode === 0) {
                alert(response.errMessage);
                await this.getAllCategories();
                this.setState({
                    isOpenAddModal: false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            } else {
                alert(response.errMessage);  // Thông báo lỗi nếu có
            }
        } catch (error) {
            console.log(error)
        }
    };




    // Cập nhật danh mục
    handleUpdateCategory = async (categoryData) => {
        try {
            let response = await updateCategory(categoryData);

            console.log('image', response)

            if (response && response.errCode === 0) {
                this.setState(prevState => ({
                    categories: prevState.categories.map(category =>
                        category.id === categoryData.id ? { ...category, ...categoryData } : category
                    )
                }));
                this.toggleEditModal(null);  // Đóng modal
            } else {
                alert(response.errMessage);
            }
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };


    render() {
        const { categories, isOpenAddModal, isOpenEditModal, selectedCategory } = this.state;

        console.log("Categories in state:", categories);  // Kiểm tra lại giá trị của categories trong state


        return (
            <div className="page-container">
                {/* Hiển thị modal thêm danh mục */}

                <ModalAddCategory
                    isOpenAddModal={this.state.isOpenAddModal} // Truyền giá trị isOpenAddModal từ state
                    toggle={this.toggleModal}  // Phương thức toggle modal
                    createNewCategory={this.createNewCategory} // Hàm tạo khách hàng mới
                />


                {/* Hiển thị modal chỉnh sửa danh mục */}
                {this.state.isOpenEditModal &&
                    <ModalEditCategory
                        isOpenEditModal={this.state.isOpenEditModal}
                        toggle={() => this.toggleEditModal(null)}
                        currentCategory={this.state.selectedCategory}
                        updateCategory={this.handleUpdateCategory}
                    />
                }


                <div className="body">
                    <div className="left-side">
                        <StaffNavigator menus={adminMenu} />
                    </div>

                    <div className="right-side">
                        <div className="top-bar">
                            <h2 className="title">Category Management</h2>
                            <div className="search-filter">
                                {/* Thanh tìm kiếm */}
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    onChange={this.handleSearch}
                                />
                                {/* Nút tạo danh mục mới */}
                                <button className="btn-create-new" onClick={() => this.handleAddNewCategory()}>
                                    Create New Category
                                </button>
                            </div>
                        </div>

                        {/* Bảng danh mục */}
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Image</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.id}</td>
                                            <td>{category.name}</td>
                                            <td>{category.description}</td>
                                            <td>
                                                {category.previewImageUrl ? (
                                                    <img src={category.previewImageUrl} width="50" alt={category.name} />
                                                ) : "No Image"}
                                            </td>
                                            <td>
                                                <button className='btn-edit fa-solid fa-pen-to-square' onClick={() => this.toggleEditModal(category)}></button>
                                            </td>
                                            <td>
                                                <button className='btn-delete' onClick={() => this.handleDeleteCategory(category.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No categories found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryManage);
