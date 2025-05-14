import React, { useEffect } from 'react'

export default function CVPdfModal({setShowModal}) {

    useEffect(() => {
        document.body.style.overflow='hidden';

        return () => {
            document.body.style.overflow='auto';
        }
    }, []);
    
  return (
    <div className="modal fade show" tabIndex="-1" role="dialog" onClick={()=>setShowModal(false)} style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
    <div className="modal-dialog modal-dialog-centered" role="document"  onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
            <div className="modal-header" style={{borderBottom: '1px solid lightgray'}}>
                <h6 className='mb-3'>View CV PDF</h6>
                <button type="button" className="btn p-0 ms-auto mb-3" style={{ width: '25px', height: '25px' }}
                    onClick={()=>setShowModal(false)} aria-label="Close">
                    <span aria-hidden="true" style={{ fontSize: '30px', fontWeight: '600' }}>×</span>
                </button>
            </div>
            <div className="modal-body pb-0 d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
                <strong className='text-dark'  style={{fontSize: '20px', marginLeft: '-8px'}}>Developer show PDF here</strong>
            </div>
            <div className="modal-footer d-flex justify-content-center">
                <button type="button" id="submitTask" className="btn btn-outline-customYelow customPrimaryBg text-white rounded-pill px-4"
                    style={{ fontSize: '16px' }} onClick={()=>setShowModal(false)}>Cancel</button>
                    <button type="button" id="submitTask" className="btn btn-outline-customYelow customPrimaryBg text-white rounded-pill px-4"
                    style={{ fontSize: '16px' }} >Confirm</button>
            </div>
        </div>
    </div>
</div>
  )
}
