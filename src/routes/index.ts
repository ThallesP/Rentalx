import { Router } from "express";

import { categoriesRoutes } from "./CategoriesRoutes";
import { specificationsRoutes } from "./SpecificationsRoutes";

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationsRoutes);

export { router };
