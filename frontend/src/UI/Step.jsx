import React from 'react'

export default function Step({step, stepNumber, icon, title, subtitle}) {
    const isActive = step === stepNumber;
    const isDisabled = step < stepNumber;
    const stepClass = isActive? 'active' : isDisabled? 'disabled' : '';

  return (
    <div className={`step ${stepClass}`}>
        <button type="button" className="step-trigger" aria-selected={isActive} disabled={isDisabled}>
            <span className="bs-stepper-circle"><i className={`icon-base ti ${icon} icon-md`}></i></span>
            <span className="bs-stepper-label">
                <span className="bs-stepper-title">{title}</span>
                <span className="bs-stepper-subtitle">{subtitle}</span>
            </span>
        </button>
    </div>
  )
}
