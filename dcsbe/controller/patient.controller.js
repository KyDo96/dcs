import {v4 as uuid} from 'uuid';
import db from "../config/db.js";



export const getPatients = async (req, res)=>{
    try {
        console.log('getPatients called');
        const response = await db('patient').orderBy('name', 'desc');
        // console.log('response patients: ', response);
        res.json(response);
    } catch (error) {
        console.log('catch error: ', error)
    }
    
};

export const createPatient = async (req, res)=>{
    // const user = req.body;
    // users.push({...user, id: uuid()});

    try {
        const response = await db('patient').insert({
            id: uuid(),
            name: req.body.name,
            mobile: req.body.mobile,
            gender: req.body.gender,
            dob: req.body.dob,
            allergen: req.body.allergen,
            status_: req.body.status_,
        });
        // console.log('insert succes: ', response);
        res.json({insertOk: true});
    } catch (error) {
        console.log('error: ', error);
        res.json({insertOk: false});
    }
    
};

export const getPatientByID = async (req, res)=>{
    // const singleUser = users.filter((user)=>user.id === req.params.id);
    const singlePatientReponse = await db('patient').where('id', req.params.id)
    res.send(singlePatientReponse);
}

export const deleteUser = async (req, res)=>{
    // users = users.filter((user)=>user.id !== req.params.id);
    try {
        const deleteUserResponse = await db('users').where('id', req.params.id).del();
         res.send('user deleted');
    } catch (error) {
        console.log('error deleting: ', error);
    }
    
}

export const updateUser = async (req, res)=>{
    // const user = users.find((user)=>user.id === req.params.id);

    const userUpdateResponse = await db('users').where('id', req.params.id).update({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
    });

    // console.log(user);
    // user.name = req.body.name;
    // user.contact = req.body.contact;
    // user.email = req.body.email;

    res.send('User Updated');
}

export const refreshToken = async (req, res)=>{
    const token = req.cookies.jid;
    console.log(token);
    if (!token) {
        return res.json({ok: false, accessToken: ''});
    }
    const payload = null;
    try {
        payload = jwt.verify(token, 'secretRefresh')
    } catch (error) {
        res.clearCookie("jid");
        console.log('catch error: ',error);
        return res.json({ok: false, accessToken: ''});
       
    }

    const user = await db('users').where('id', payload.userId);
    if (!user) {
        return res.json({ok: false, accessToken: ''});
    }

    return res.json({ok: true, accessToken: jwt.sign({userId: checkEmail.id},
        "secretAccess", {expiresIn: "2min"}
    )})
}