import React from 'react'

export default function InputField({label, id, type, name, placeholder, validation, error, register, disabled}) {
  return (
    <div className="col-sm-6">
        <label className="form-label" htmlFor={id}>{label}</label>
        <input type={type} id={id} name={name} className="form-control" placeholder={placeholder} {...register(name, validation)} disabled={disabled}/>
        {error && <small className="text-danger">{error.message}</small>}
    </div>
  )
}
