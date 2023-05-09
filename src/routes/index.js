import initHouseRoute from './house';
import initLandlordRoute from './landlord';
import initTenantRoute from './tenant';
import initDetailsRoute from './details_house';
import initListRoute from './list-houses';
import initUtilityRoute from './utility';

export default function (app) {
  app.use("/api", initUtilityRoute);
  app.use("/landlord", initLandlordRoute);
  app.use("/tenant", initTenantRoute);
  app.use("/house", initHouseRoute);
  app.use("/details/:id", initDetailsRoute);
  app.use("/list", initListRoute);
  app.use("/", (req, res, next) => {
    res.render("vwGuest/guest-main");
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