import db from "../config/db.config";
import bcrypt from "bcrypt"


const getUserByUsername = async (username) => {
  const user = await db('nguoidung').where('TaiKhoan', username).first();
  console.log(user)
  return user;
};
const getUserByEmail = async (email) => {
  const user = await db('nguoidung').where('Email', email).first();
  return user;
};
const getUserByPhone = async (phone) => {
  const user = await db('nguoidung').where('SDT', phone).first();
  return user;
};

const addUser = async (username, phone, password, type, status) => {
  try {
    await db('nguoidung').insert({
      SDT: phone,
      TaiKhoan: username,
      MatKhau: password,
      LoaiNguoiDung: type,
      TrangThai: status
    });
    return true;
  } catch (error) {
    console.log('Error adding user: ', error);
    return false;
  }
};

const checkUserCredential = async (TaiKhoan, MatKhau) => {
  const user = await getUserByUsername(TaiKhoan);
  //console.log(user)
  if (!user) {
    return null;
  }
  if (user.TrangThai == "Bị khóa")
    return 1;
  const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
  if (isMatch) {
    return user;
  } else {
    return null;
  }
};
const updatePasswordModel = async (idUser, newPass) => {
  const hashedPassword = await bcrypt.hash(newPass, 10);

  await db('nguoidung').where('NguoiDungID', '=', idUser).update({
    MatKhau: hashedPassword
  })

}
const findUserById = async (id) => {
  const user = await db('nguoidung').where('NguoiDungID', id).first();
  return user;
}

export default {
  findAll() {
    return db('nguoidung');
  },

  async findById(id) {
    const user = await db('nguoidung').where('NguoiDungID', id).first();
    return user;
  },

  async add(user) {
    delete user.id;
    user.MatKhau = await bcrypt.hash(user.MatKhau, 10);

    return db('nguoidung').insert(user);
  },

  del(id) {
    return db('nguoidung').where('NguoiDungID', id).del();
  },

  block(id) {
    return db('nguoidung').where('NguoiDungID', id).update({
      TrangThai: 'Bị khóa'
    });
  },

  unblock(id) {
    return db('nguoidung').where('NguoiDungID', id).update({
      TrangThai: 'Hoạt động'
    });
  },


  patch(user) {
    const id = user.id;
    delete user.id;

    return db('nguoidung').where('NguoiDungID', id).update({
      HoTen: user.HoTen,
      SDT: user.SDT,
      Email: user.Email,
      TaiKhoan: user.TaiKhoan,
      GioiTinh: user.GioiTinh,
      NgaySinh: user.NgaySinh,
      LoaiNguoiDung: user.LoaiNguoiDung,
      TrangThai: user.TrangThai
    })
  },

  patchProfile(user) {
    const id = user.id;
    delete user.id;

    return db('nguoidung').where('NguoiDungID', id).update({
      HoTen: user.HoTen,
      SDT: user.SDT,
      Email: user.Email,
      TaiKhoan: user.TaiKhoan,
      GioiTinh: user.GioiTinh,
      NgaySinh: user.NgaySinh,
    })
  },

  patchPassword(user) {
    const id = user.id;
    delete user.id;

    return db('nguoidung').where('NguoiDungID', id).update({
      MatKhau: user.MatKhau,
    })
  },

  async findByRole(role) {
    if (role === '1') role = 'Người thuê trọ';
    else if (role === '2') role = 'Người chủ trọ';
    else if (role === '3') role = 'Admin';
    else return db('nguoidung');

    return db('nguoidung').where('LoaiNguoiDung', role);
  },

  async countByrole(role) {
    const list = await db('nguoidung')
      .where('LoaiTaiKhoan', role)
      .count({ amount: 'NguoiDungID' });

    return list[0].amount;
  },

  async findUsername(username) {
    return db('nguoidung').where('TaiKhoan', username);
  },

  async findAllUserID() {
    return db('nguoidung').select('NguoiDungID', 'HoTen');
  }
}

const getInfoProfileTenant = async (idUser) => {
  const res = await db('nguoidung').where('NguoiDungID', '=', idUser).select('HoTen', 'DiaChi', 'SDT', 'GioiTinh', 'NgaySinh', 'Email', 'GioiThieu', 'TaiKhoan', 'avatar');
  return res[0];
}
const updateProfileTenantModel = async (idUser, data, file) => {
  //console.log(file)
  if (file) {
    const res = await db('nguoidung').where('NguoiDungID', '=', idUser).update({
      HoTen: data.updateFullname,
      DiaChi: data.cities,
      SDT: data.updatePhone,
      GioiTinh: data.updateSex,
      GioiThieu: data.updateIntro,
      avatar: file
    })
  }
  else {
    const res = await db('nguoidung').where('NguoiDungID', '=', idUser).update({
      HoTen: data.updateFullname,
      DiaChi: data.cities,
      SDT: data.updatePhone,
      GioiTinh: data.updateSex,
      GioiThieu: data.updateIntro,
    })
  }

}
const getInfoProfileLandlord = async (idUser) => {
  const res = await db('nguoidung').where('NguoiDungID', '=', idUser).select('HoTen', 'DiaChi', 'SDT', 'GioiTinh', 'NgaySinh', 'Email', 'GioiThieu', 'TaiKhoan', 'avatar');
  return res[0];
}
const updateProfileLandlordModel = async (idUser, data, file) => {
  //console.log(file)
  if (file) {
    const res = await db('nguoidung').where('NguoiDungID', '=', idUser).update({
      HoTen: data.updateFullname,
      DiaChi: data.cities,
      SDT: data.updatePhone,
      GioiTinh: data.updateSex,
      GioiThieu: data.updateIntro,
      avatar: file
    })
  }
  else {
    const res = await db('nguoidung').where('NguoiDungID', '=', idUser).update({
      HoTen: data.updateFullname,
      DiaChi: data.cities,
      SDT: data.updatePhone,
      GioiTinh: data.updateSex,
      GioiThieu: data.updateIntro,
    })
  }

}
const getAllListReviewModel = async (idUser) => {
  console.log(idUser)
  const res = await db('danhgia')
    .join('tindangtro', 'danhgia.TinID', '=', 'tindangtro.TinID')
    .join('nguoidung', 'danhgia.NguoiDanhGia', '=', 'nguoidung.NguoiDungID')
    .where('tindangtro.NguoiDangTin', idUser)
    .select('*');
  return { houses: res, pages: Math.ceil(res.length / 5) };

}
const getListReviewPageModel = async (idUser, limit, offset) => {
  const res = await db('danhgia')
    .join('tindangtro', 'danhgia.TinID', '=', 'tindangtro.TinID')
    .join('nguoidung', 'danhgia.NguoiDanhGia', '=', 'nguoidung.NguoiDungID')
    .where('tindangtro.NguoiDangTin', idUser)
    .select('*')
    .limit(limit)
    .offset(offset)
  return res;

}

export {
  checkUserCredential,
  findUserById,
  addUser,
  getUserByEmail,
  getUserByUsername,
  getUserByPhone,
  getInfoProfileLandlord,
  getInfoProfileTenant,
  updateProfileLandlordModel,
  updateProfileTenantModel,
  updatePasswordModel,
  getAllListReviewModel,
  getListReviewPageModel
}