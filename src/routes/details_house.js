import express from 'express';
const initDetailsRoute = express.Router();
import { getDetailsPage } from '../controllers/details.controller';

initDetailsRoute.route("/").get(getDetailsPage);

export default initDetailsRoute;