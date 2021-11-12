import { Router } from "express";

import { authenticateRoutes } from "./AuthenticateRoutes";
import { carsRoutes } from "./CarsRoutes";
import { categoriesRoutes } from "./CategoriesRoutes";
import { passwordRoutes } from "./PasswordRoutes";
import { rentalRoutes } from "./RentalRoutes";
import { specificationsRoutes } from "./SpecificationsRoutes";
import { usersRoutes } from "./UsersRoutes";

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/users", usersRoutes);
router.use("/cars", carsRoutes);
router.use("/rentals", rentalRoutes);
router.use("/passwords", passwordRoutes);
router.use(authenticateRoutes);

export { router };
