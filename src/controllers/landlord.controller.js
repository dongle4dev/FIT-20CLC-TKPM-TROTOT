const getPostHousePage = async (req, res) => {
    res.render("vwLandlord/post-house")
}
const getHouseManagementPage = async (req, res) => {
    return res.render("vwLandlord/house-management")
}
const getManageAppointmentPage = async (req, res) => {
    return res.render("vwLandlord/manage-appointment")
}
const getOwnerPage = async (req, res) => {
    res.render("vwLandLord/main_page")
}
export { getPostHousePage, getHouseManagementPage, getManageAppointmentPage, getOwnerPage }