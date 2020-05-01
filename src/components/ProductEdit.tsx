import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import ProductService from "../services/ProductService";
import { MealModel } from "../models/MealModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface RouteParams {
  id: string;
}

export default () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [meal, setMeal] = useState(new MealModel());
  const handleFormSubmit = async (data: any) => {};
  let active = true;
  const match = useRouteMatch<{ id: string }>();

  const fetchProduct = async (id: number | null) => {
    setError(false);
    setMeal(new MealModel());
    if( id === null || id === undefined ) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const meal = await ProductService.getMeal(id);
      console.log(meal);
      if (active === true) {
        setLoading(false);
        setMeal(meal)
      }
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    document.title = 'Product Form';
    const id = match.params.id;
    fetchProduct(id !== undefined ? Number(id) : null);
    return () => {
      active = false;
    };
  }, []);


  return (
    <div className="row">
      <div className="col-12">
        <h5 className="display-4 text-center font-weight-bold text-primary mt-4">
          <FontAwesomeIcon icon="file-medical-alt" /> Product Form Data | {error && !loading && meal?.id == null ? 
                                'Add New Product' : 'Edit Product'}
        </h5>
      </div>
      <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9 mx-auto mt-5">
        {loading && (
          <div className="shadow p-3 mb-5 bg-white rounded text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="shadow p-3 mb-5 bg-danger rounded text-center text-white">
            <h2 className="font-weight-bold">
              <FontAwesomeIcon icon="exclamation-circle" /> No meal has been found!
              <Link to="/products" className="btn btn-light ml-3"> <FontAwesomeIcon icon="align-left" /> Go To Products</Link>
            </h2>
          </div>
        )}
        {!loading && !error && (
          <div className="shadow p-3 mb-5 bg-white rounded">
            <form>
              <label>Name: </label>
              <input type="text" className="form-control" name="name" onChange={e => meal.name = e.target.value} value={meal.name || ''} />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
