import PropTypes from 'prop-types';
import { PRODUCT_CATEGORIES } from './constants';

// Product PropTypes definition
export const ProductPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number.isRequired,
  category: PropTypes.oneOf(PRODUCT_CATEGORIES).isRequired,
  stock: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired
};

// Product List PropTypes
export const ProductListPropTypes = PropTypes.arrayOf(
  PropTypes.shape(ProductPropTypes)
);

// Filter State PropTypes
export const FilterStatePropTypes = {
  search: PropTypes.string,
  category: PropTypes.string,
  minPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stockStatus: PropTypes.string,
  sortBy: PropTypes.string
};

// Product Form Data PropTypes
export const ProductFormDataPropTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  category: PropTypes.string,
  stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imageUrl: PropTypes.string
};