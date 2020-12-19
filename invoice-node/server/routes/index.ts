import { prepare_request } from "@server/middlewares";
import { Router } from "express";

const router = Router();
router.use(prepare_request());

router.use("/invoice", require("./invoice").default);
router.get("/test", require("./test").default);

export default router;
