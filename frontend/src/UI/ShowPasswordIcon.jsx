import React from 'react'

export default function ShowPasswordIcon({showPassword, setShowPassword}) {
    
  return (
    <button type='button'className='btn position-absolute  btns-view'
        style={{top: '24px', right: '0px' }} onClick={()=>setShowPassword(!showPassword)}>
            {showPassword ?(
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.94 10.94 0 0112 5c4.478 0 8.268 2.943 9.542 7-.323 1.028-.805 1.99-1.419 2.86m-2.618 2.618A10.945 10.945 0 0112 19c-4.477 0-8.268-2.943-9.542-7a11.096 11.096 0 011.511-2.567"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 01-4.242 4.242M9.879 9.878a3 3 0 014.242 4.243"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/>
                </svg> 
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
            )}
    </button>
  )
}
