import ApiError from "../../exceptions/apiError";
import {check} from "express-validator";
import UnitedAdditionalController from "../../controllers/additionalController.ts/UnitedAdditionalController";

const {Router} = require('express');
const router = Router();

//  /api/roles
router.get('/', UnitedAdditionalController.getRoles)

module.exports = router;