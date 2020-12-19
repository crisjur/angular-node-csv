import { Router } from "express";
import { SvInvoice } from "@server/services";
import { parse_query } from "@server/middlewares";

const router = Router();

router.post("/upload", parse_query(), SvInvoice.uploadCSV());
router.get("/list", parse_query(), require("./list").default);

export default router;
