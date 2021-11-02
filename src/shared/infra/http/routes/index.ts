import { Router } from "express";

import { authenticateRoutes } from "./AuthenticateRoutes";
import { carsRoutes } from "./CarsRoutes";
import { categoriesRoutes } from "./CategoriesRoutes";
import { rentalRoutes } from "./RentalRoutes";
import { specificationsRoutes } from "./SpecificationsRoutes";
import { usersRoutes } from "./UsersRoutes";

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/users", usersRoutes);
router.use("/cars", carsRoutes);
router.use("/rentals", rentalRoutes);
router.use(authenticateRoutes);

export { router };
