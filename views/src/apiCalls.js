import axios from 'axios'


export const loginCall = async (userCredentials,dispatch)=>{
    dispatch({type:"LOGIN_START"})
    try{
        const res = await axios.post("/auth/login", userCredentials)
        dispatch({type:"LOGIN_SUCCESS", payload:res.data});
 
    }catch(err){
        dispatch({type:"LOGIN_FAILURE", payload:err });
    }
}

export const logoutCall = async (userCredentials,dispatch)=>{
    dispatch({type:"LOGOUT_START"})
    try{
        const res = await axios.post("/auth/logout", userCredentials)
        dispatch({type:"LOGOUT_SUCCESS", payload:res.data});
    }catch(err){
        dispatch({type:"LOGOUT_FAILURE", payload:err });
    }   
}