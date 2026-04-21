import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Button} from 'daisyui'

function Signupbtn({ variant = 'primary', className = '' }) {
    const navigate = useNavigate();
    const handlesignup = ()=>{
        navigate("/login");
    }
    const variantClass = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
      }[variant] || 'btn-primary';
  return (
    <Button 
     classname = {`btn btn-sm ${variantClass} ${className}`}
     onClick = {handlesignup}
    >
        sign up
    </Button>
  )
}

export default Signupbtn