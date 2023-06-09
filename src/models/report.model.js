import db from "../config/db.config";

const addingReport = async (idTenant, idPost, data) => {
    await db('baocao').insert({
        NguoiBaoCao: idTenant,
        TinID: idPost,
        LiDoChiTiet: data.description,
    })
}

const findAllReports = async () => {
    return await db('baocao').select('*');
}


export { addingReport, findAllReports }