import React from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {Button} from 'daisyui'
import {logout} from '../../store/authSlice'

function Logoutbtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logouthandler = ()=>{
        dispatch(logout);
        navigate("/");
    }
  return (
    <Button 
        classname='text-red-600 hover:bg-red-50'
        variant = ''
        onClick = {logouthandler}
    >
        Logout
    </Button>
  )
}

export default Logoutbtn