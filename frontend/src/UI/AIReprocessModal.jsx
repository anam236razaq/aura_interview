import React, { useEffect } from 'react'

export default function AIReprocessModal({setShowModal}) {

    useEffect(() => {
                document.body.style.overflow='hidden';
        
                return () => {
                    document.body.style.overflow='auto';
                }
        }, []);

  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Info</h5>
                    </div>
                    <p>These Candidate CV list will not be processing.</p>
                    <ol style={{marginLeft: '-12px'}}>
                        <li className='mb-1'>Sanaullah (sanaullah@gmail.com) - Inactive</li>
                        <li className='mb-1'>Mudasir Khan (email@gmail.com - Draft</li>
                        <li className='mb-1'>Name 4 (email5@gmail.com) - Draft</li>
                        <li className='mb-1'>Name 1 (email@gmail.com) - Processing</li>
                    </ol>
                    <div className="col-12 d-flex align-items-center justify-content-end">
                        <button type="reset" className="btn btn-label-secondary  me-3"
                            onClick={()=> setShowModal(false)}>Close
                        </button>
                        <button type="submit" className="btn btn-primary">Reprocess</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
