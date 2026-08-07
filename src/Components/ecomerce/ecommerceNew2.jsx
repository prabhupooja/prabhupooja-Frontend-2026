import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import "./ecommerceNew2.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useUserCardStore from "../../Store/userCardStore/userCardStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useHomeStore from "../../Store/dataStore/homeStore";
import { TailSpin } from "react-loader-spinner";
import CryptoJS from "crypto-js";
import { FaFire, FaGem, FaYinYang, FaStar, FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";

const categoryList = [
  { name: "All Products", icon: <FaFire />, value: "" },
  { name: "Trending", icon: <FaStar />, value: "trending" },
  { name: "Online Pooja", icon: <FaYinYang />, value: "online-pooja" },
  { name: "Gemstones", icon: <FaGem />, value: "gemstones" },
  { name: "Yantras", icon: <FaYinYang />, value: "yantras" },
];

const EcommerceNew2 = () => {
  const [filter, setFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const [loading, setLoading] = useState(null);

  const [bestSellers, setBestSellers] = useState([]);

  const lastProductRef = useRef(null);

  const { addToCart, getCartItems } = useUserCardStore();
  const { user1 } = useAuthStore();
  const {
    products = [],
    setProducts,
    getFilterProducts,
    isLoading,
  } = useHomeStore();

  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
      setPage(1);
      setHasMore(true);
    }, 500),
    []
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    debounceSearch(e.target.value);
  };

  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setSelectedMaterial((prev) => (prev === value ? "" : value));
    setPage(1);
    setHasMore(true);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory((prev) => (prev === value ? "" : value));
    setPage(1);
    setHasMore(true);
  };

  const handleSortChange = (e) => setSortBy(e.target.value);

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getFilterProducts({
        page,
        limit,
        search: debouncedSearch,
        material: selectedMaterial,
        category: selectedCategory,
      });

      if (res?.success && Array.isArray(res.productData)) {
        setBestSellers(res.bestSellers || []);
        if (res.productData.length === 0) {
          setHasMore(false);
          if (page === 1) setProducts([]);
          return;
        }

        if (page === 1) {
          setProducts(res.productData);
        } else {
          setProducts((prev) => [...(prev || []), ...res.productData]);
        }
      }
    };
    fetchData();
  }, [page, debouncedSearch, selectedMaterial, selectedCategory]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentRef = lastProductRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, isLoading, products]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
    }
    return sorted;
  }, [products, sortBy]);

  const handleAddToCart = async (product) => {
    setLoading(product);
      try {
        const response = await addToCart({
          user_id: user1?.id,
          product:product,
          quantity: 1,
        });
        getCartItems(user1?.id);
        Swal.fire(
          response.success ? "Success" : "Failed",
          response.success ? "Product added to cart" : "Could not add to cart",
          response.success ? "success" : "error"
        );
      } catch {
        Swal.fire("Error", "Something went wrong", "error");
      } finally {
        setLoading(null);
      }
  };

  return (
    <>
      <div className="sub_header_ecommerce">
        <div className="container">
          <div className="subheader_inner_ecommerce">
            {/* <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">E-commerce</li>
              </ol>
            </nav> */}
          </div>
        </div>
      </div>

      <div className="NewproductContainerFull">
        {/* LEFT FILTER */}
        <div className="leftProductContainer">
          <div className="leftConatilnerBox">
            <h3>Categories</h3>
            <ul className="categoryList">
              {categoryList?.map((cat) => (
                <li
                  key={cat.name}
                  className={selectedCategory === cat.value ? "active" : ""}
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.icon} {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="leftConatilnerBox">
            <h3>Refined Search</h3>
            <div className="checkboxGroup">
              {["Gold", "Silver", "Brooch & Pendant"].map((mat) => (
                <label key={mat} className="checkboxContainer">
                  <input
                    type="checkbox"
                    value={mat}
                    checked={selectedMaterial === mat}
                    onChange={handleMaterialChange}
                  />
                  <span className="checkmark"></span>
                  {mat}
                </label>
              ))}
            </div>
          </div>

          <div className="leftConatilnerBox">
            <h3>Best Seller</h3>
            {bestSellers && bestSellers.length > 0 ? (
              bestSellers.map((product, index) => (
                <div className="bestSellerbox" key={product.id || index}>
                  <img
                    src={
                      product.image?.[0] || "https://via.placeholder.com/150"
                    }
                    alt="bestSellerImg"
                  />
                  <div className="bestSellerDetails">
                    <p className="productName">{product.productName}</p>
                    <p className="price">₹{product.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No best sellers found.</p>
            )}
          </div>
        </div>

        {/* RIGHT PRODUCTS */}
        <div className="rightProductContainer">
          <div className="bannerContainer">
            <img src={require("../Assets/productBanner.png")} alt="banner" />
            <p>
              Shop from our exclusive range of online Poojas, horoscope
              services, astrological remedies, and spiritual products.
            </p>
          </div>

          <div className="fillterContainer">
            <h2>Refine Search</h2>
            <div className="fillterButtons">
              <div className="searchInput">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search Your Product"
                  value={filter}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filterButtons">
                <label htmlFor="sortBy">Sort By:</label>
                <select
                  id="sortBy"
                  className="sortDropdown"
                  onChange={handleSortChange}
                  value={sortBy}
                >
                  <option value="default">Default</option>
                  <option value="name-asc">Name (A - Z)</option>
                  <option value="name-desc">Name (Z - A)</option>
                  <option value="price-asc">Price (Low &gt; High)</option>
                  <option value="price-desc">Price (High &gt; Low)</option>

                </select>
              </div>
            </div>
            {debouncedSearch && <p>Search Result: {debouncedSearch}</p>}
          </div>
        {isLoading && page === 1 ? (
  <div className="ecom-loader">
    <TailSpin height="50" width="50" color="orange" />
    <p>Loading products...</p>
  </div>
) : (
  <div className="productBoxs">
    {sortedProducts.length === 0 ? (
      <div className="no-products">No Products Found</div>
    ) : (
      sortedProducts.map((product, index) => {
        const encryptedId = encryptId(product.id);
        const isLast = index === sortedProducts.length - 1;

        return (
          <div
            className="box"
            key={product.id}
            ref={isLast ? lastProductRef : null}
          >
            <Link to={`/productdetails/${encryptedId}`}>
              <img src={product.image[0]} alt={product.productName || "NA"} />
            </Link>
            <h3>{product.productName || "NA"}</h3>
            <p>Price: ₹{product.price}</p>
            <p style={{ color: "green" }}>Offer: ₹{product.offerPrice || "NA"}</p>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={loading === product.id}
            >
              {loading === product.id ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        );
      })
    )}

    {isLoading && page > 1 && hasMore && (
      <div className="ecom-loader">
    <TailSpin height="50" width="50" color="orange" />
  </div>
    )}
  </div>
)}

          
        </div>
      </div>
    </>
  );
};

export default EcommerceNew2;
