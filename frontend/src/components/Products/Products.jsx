import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Pagination from "@mui/material/Pagination";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearErrors, getProducts } from "../../actions/productAction";
import Loader from "../Layouts/Loader";
import MinCategory from "../Layouts/MinCategory";
import Product from "./Product";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarIcon from "@mui/icons-material/Star";
import { useLocation } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const location = useLocation();

  const [price, setPrice] = useState([0, 200000]);
  const [category, setCategory] = useState(location.search ? location.search.split("=")[1] : "");
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryToggle, setCategoryToggle] = useState(true);
  const [ratingsToggle, setRatingsToggle] = useState(true);

  const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector(
    (state) => state.products
  );

  const keyword = params.keyword;

  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
  };

  const clearFilters = () => {
    setPrice([0, 200000]);
    setCategory("");
    setRatings(0);
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getProducts(keyword, category, price, Number(ratings), currentPage));
  }, [dispatch, keyword, category, price, ratings, currentPage, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="All Products | Flipkart" />
      <MinCategory />
      <main className="w-full mt-14 sm:mt-0">
        <div className="flex gap-3 mt-2 sm:mt-2 sm:mx-3 m-auto mb-7">
          {/* Sidebar - Filters */}
          <div className="hidden sm:flex flex-col w-1/5 px-2 bg-white shadow-lg rounded-lg p-4">
            {/* Filters Header */}
            <div className="flex items-center justify-between gap-5 border-b pb-2">
              <p className="text-lg font-semibold">Filters</p>
              <span
                className="uppercase text-primary-blue text-xs cursor-pointer font-medium"
                onClick={clearFilters}
              >
                Clear All
              </span>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col gap-4 py-3 text-sm">
              {/* Price Filter */}
              <div className="flex flex-col gap-2 border-b pb-3">
                <span className="font-medium text-xs">PRICE</span>
                <Slider
                  value={price}
                  onChange={priceHandler}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200000}
                />
                <div className="flex justify-between text-sm">
                  <span>₹{price[0].toLocaleString()}</span>
                  <span className="font-medium text-gray-500">to</span>
                  <span>₹{price[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Category Filter */}
              <div className="border-b pb-3">
                <div
                  className="flex justify-between cursor-pointer items-center"
                  onClick={() => setCategoryToggle(!categoryToggle)}
                >
                  <p className="font-medium text-xs uppercase">Category</p>
                  {categoryToggle ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>

                {categoryToggle && (
                  <FormControl>
                    <RadioGroup onChange={(e) => setCategory(e.target.value)} value={category}>
                      {categories.map((el, i) => (
                        <FormControlLabel key={i} value={el} control={<Radio size="small" />} label={el} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </div>

              {/* Ratings Filter */}
              <div className="border-b pb-3">
                <div
                  className="flex justify-between cursor-pointer items-center"
                  onClick={() => setRatingsToggle(!ratingsToggle)}
                >
                  <p className="font-medium text-xs uppercase">Ratings</p>
                  {ratingsToggle ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>

                {ratingsToggle && (
                  <FormControl>
                    <RadioGroup onChange={(e) => setRatings(Number(e.target.value))} value={ratings}>
                      {[4, 3, 2, 1].map((el, i) => (
                        <FormControlLabel
                          key={i}
                          value={el}
                          control={<Radio size="small" />}
                          label={
                            <span className={`flex items-center text-sm ${ratings === el ? "text-primary-blue font-bold" : ""}`}>
                              {el} <StarIcon sx={{ fontSize: "14px", ml: 0.5, color: "#FFD700" }} /> & above
                            </span>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </div>
            </div>
          </div>

          {/* Main Product Section */}
          <div className="flex-1">
            <p className="text-gray-600 text-sm">{filteredProductsCount} products found</p>

            {loading ? (
              <Loader />
            ) : (
              <div className="flex flex-col gap-2 pb-4 items-center w-full bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-4 w-full border-b">
                  {products
                    ?.map((product) => ({
                    
                      ...product,
                      ratings: product.ratings || (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
                      numOfReviews: product.numOfReviews || Math.floor(Math.random() * (200 - 20) + 20),
                      
                    }))
                    
                    .filter((product) => product.ratings >= ratings) // Filter by ratings
                    .sort((a, b) => b.ratings - a.ratings) // Sort by highest ratings
                    .map((product) => (
                     console.log("product", product),
                      <Product key={product._id} {...product} />
                    ))}
                </div>

                {filteredProductsCount > resultPerPage && (
                  <div className="flex justify-center mt-4">
                    <Pagination
                      count={Math.ceil(filteredProductsCount / resultPerPage)}
                      page={currentPage}
                      onChange={(e, val) => setCurrentPage(val)}
                      color="primary"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Products;
