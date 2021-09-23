import { Router } from "express";

import { authenticateRoutes } from "./AuthenticateRoutes";
import { categoriesRoutes } from "./CategoriesRoutes";
import { specificationsRoutes } from "./SpecificationsRoutes";
import { usersRoutes } from "./UsersRoutes";

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/users", usersRoutes);
router.use(authenticateRoutes);

export { router };
