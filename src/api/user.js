import request from '../utils/request.js'
export const userRegisterService = ({
    username,
    password,
    repassword,
}) => request.post('/api/reg', {
    username,
    password,
    repassword,
})

export const userLoginService = ({ 
    username, 
    password
}) => request.post('api/login', { 
    username, 
    password
})

export const userGetInfoService = () => request.get('/my/userinfo')

export const userUpdateInfoService = ({ id, nickname, email }) =>
    request.put('/my/userinfo', { id, nickname, email })

export const userUpdatePWDService = ({ old_pwd, new_pwd, re_pwd }) => 
    request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })

export const userUpdateAvatarService = (avatar) => 
    request.patch('/my/update/avatar', { avatar })