import initHouseRoute from './house';
import initTenantRoute from './tenant';
import initDetailsRoute from './details_house';
import initListRoute from './list-houses';
import initLandlordRoute from './landlord';
import initAdminRoute from './admin.route';
import apiRoute from './api';

export default function (app) {
  app.use("/api", apiRoute);
  app.use("/tenant", initTenantRoute);
  app.use("/landlord", initLandlordRoute);
  app.use("/house", initHouseRoute);
  app.use("/admin", initAdminRoute);
  app.use("/details/:id", initDetailsRoute);
  app.use("/list", initListRoute);

  app.use("/", (req, res, next) => {
    try {
      res.render("home");
    } catch (err) {
      next(err);
    }
  });

  app.use(function (req, res, next) {
    res.render("404", { layout: false });
  });

  app.use(function (err, req, res, next) {
    res.status(500).render("500", {
      stack: err.stack,
      layout: false,
    });
  });
}