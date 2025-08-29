import { useEffect } from 'react';

export default function DeleteModal({confirmDelete, setShowDeleteModal}) {

    useEffect(() => {
        document.body.style.overflow='hidden';
        return () => { document.body.style.overflow='auto'; }
    }, []);

  return (
     <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowDeleteModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowDeleteModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <h5>Are you sure you want to delete?</h5>
                    <div className="col-12 d-flex align-items-center justify-content-end">
                        <button type="reset" className="btn btn-label-secondary w-50  me-3"
                            onClick={()=> setShowDeleteModal(false)}>Close
                        </button>
                        <button type="submit" className="btn btn-primary w-50" onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
