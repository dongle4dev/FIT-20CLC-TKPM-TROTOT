import {
    getAllHousesOfLandlord,
    getLandlordHouseListModel,
    getAllHouseAppointmentLandlord,
    getLandlordHouseAppointmentListModel,
    getDetailedHouseModel
} from "../models/post.model";
import { findUtilitiesOfHouse } from "../models/utility.model";
import { findPhotosOfHouse } from "../models/photo.model";
import { findVideosOfHouse } from "../models/video.model";
import { getInfoProfileLandlord, updateProfileLandlordModel, getInfoProfileTenant, getListReviewPageModel, getAllListReviewModel } from "../models/user.model";
import { confirmAppointmenLandlord, cancelAppointmentModel } from "../models/appointment.model";
const getPostHousePage = async (req, res) => {
    res.render("vwLandlord/post-house")
}
const getHouseManagementPage = async (req, res) => {
    let { page, filter } = req.query;
    const idUser = res.locals.user.id;
    if (!page) page = 1;
    const { houses, pages } = await getAllHousesOfLandlord(idUser, filter);
    //console.log(filter, page)
    const result = await getLandlordHouseListModel(idUser, 5, (page - 1) * 5, filter);
    for (let house of result) {
        const temp = await findPhotosOfHouse(house.TinID);
        house.photo = temp[0].ChiTietHinhAnh;
        const date = new Date(house.NgayDang);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const vietnameseDate = date.toLocaleDateString('vi-VN', options);
        const vietnameseTime = date.toLocaleTimeString('vi-VN');
        house.NgayDang = vietnameseDate + ' ' + vietnameseTime;
        let str = house.Gia.toString();
        let result = '';
        while (str.length > 3) {
            result = '.' + str.slice(-3) + result;
            str = str.slice(0, -3);
        }
        result = str + result;
        house.Gia = result;
    }
    return res.render("vwLandlord/house-management", { page: page ? parseInt(page) : 1, pages: parseInt(pages), houses: result })
}
const getManageAppointmentPage = async (req, res) => {
    let { page, filter } = req.query;
    const idUser = res.locals.user.id;
    if (!page) page = 1;
    const { houses, pages } = await getAllHouseAppointmentLandlord(idUser, filter);
    //console.log(filter, page)
    const result = await getLandlordHouseAppointmentListModel(idUser, 5, (page - 1) * 5, filter);
    for (let house of result) {
        const temp = await findPhotosOfHouse(house.TinID);
        house.photo = temp[0].ChiTietHinhAnh;
        let date = new Date(house.NgayDatHen);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let vietnameseDate = date.toLocaleDateString('vi-VN', options);
        let vietnameseTime = date.toLocaleTimeString('vi-VN');
        house.NgayDatHen = vietnameseDate + ' ' + vietnameseTime;
        date = new Date(house.NgayGap);
        vietnameseDate = date.toLocaleDateString('vi-VN', options);
        vietnameseTime = date.toLocaleTimeString('vi-VN');
        house.NgayGap = vietnameseDate + ' ' + vietnameseTime;
        let str = house.Gia.toString();
        let result = '';
        while (str.length > 3) {
            result = '.' + str.slice(-3) + result;
            str = str.slice(0, -3);
        }
        result = str + result;
        house.Gia = result;
        const user = await getInfoProfileTenant(house.NguoiDatHen);
        house.TenNguoiDatHen = user.TaiKhoan;
        house.SDTNguoiDatHen = user.SDT;
    }
    return res.render("vwLandlord/manage-appointment", { page: page ? parseInt(page) : 1, pages: parseInt(pages), houses: result })
}
const getProfilePage = async (req, res) => {
    const idUser = res.locals.user.id;
    const user = await getInfoProfileLandlord(idUser);
    const date = new Date(user.NgaySinh);
    let time = date.toISOString().substring(0, 10);
    const newDate = new Date(time);
    newDate.setDate(newDate.getDate() + 1);
    const newDateStr = newDate.toISOString().slice(0, 10);
    user.NgaySinh = newDateStr;
    res.render("vwLandlord/landlord-profile", { idUser, user })
}
const getChangePassPage = async (req, res) => {
    res.render("vwLandlord/change-password")
}
const getEditHousePage = async (req, res) => {
    const id = req.params.id;
    const house = await getDetailedHouseModel(id);
    let photos = await findPhotosOfHouse(id);
    let videos = await findVideosOfHouse(id);
    let utilities = await findUtilitiesOfHouse(id);
    house.DiaChi = house.DiaChi.split(', ');
    house.ThanhPho = house.DiaChi[3];
    house.Quan = house.DiaChi[2];
    house.Phuong = house.DiaChi[1];
    house.DiaChiCuThe = house.DiaChi[0];
    utilities = utilities.map(item => item.TienIchID);

    res.render("vwLandlord/update-house", { house, photos: JSON.stringify(photos), utilities, videos: JSON.stringify(videos) });
}
const updateProfile = async (req, res) => {
    const idUser = res.locals.user.id;
    let ava = '';
    //console.log(req.body, req.file);
    if (req.file)
        ava = '../.' + req.file.destination + req.file.filename;
    await updateProfileLandlordModel(idUser, req.body, ava);
    res.redirect('/landlord/profile')
}
const confirmAppointment = async (req, res) => {
    const { id } = req.params;
    await confirmAppointmenLandlord(id);
    return res.redirect('/landlord/manage-appointment');
}
const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    await cancelAppointmentModel(id);
    return res.redirect('/landlord/manage-appointment');
}
const checkCurrentPassword = async (req, res) => {
    const password = req.body.password;
    const username = res.locals.user.username;
    const user = await checkUserCredential(username, password);
    
    if (user)
        return res.status(200).json({ ok: true });
    req.flash('errorChangePass', 'Mật khẩu không đúng');
    res.status(201).json({ ok: false });
}
const updatePassword = async (req, res) => {
    const { newPass } = req.body;
    const idUser = res.locals.user.id;
    await updatePasswordModel(idUser, newPass);
    res.redirect("/tenant/profile");
}
const getListReviewPage = async (req, res) => {
    const idUser = res.locals.user.id;
    let { page } = req.query;
    if (!page) page = 1;
    //console.log(filter, page)
   
    const { reviews, pages} = await getAllListReviewModel(idUser);
    const result = await getListReviewPageModel(idUser, 5, (page - 1) * 5);
    console.log(result, page, pages)

    res.render('vwLandlord/manage-review', { page, pages, reviews: result });
}
export {
    getPostHousePage,
    getHouseManagementPage,
    getManageAppointmentPage,
    getProfilePage,
    getChangePassPage,
    updateProfile,
    confirmAppointment,
    deleteAppointment,
    getEditHousePage,
    checkCurrentPassword,
    updatePassword,
    getListReviewPage
}