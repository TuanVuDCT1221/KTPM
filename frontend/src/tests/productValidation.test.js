import {validateProduct} from "../utils/productValidation.js";
import { describe, it, expect } from "@jest/globals";

const baseProduct = {
    name: "Cà phê sữa",
    price: 20000,
    quantity: 10,
    description: "Cà phê sữa siêu ngon",
    category: "Coffee",
};

describe
