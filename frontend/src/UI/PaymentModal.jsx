import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../utils/Constants';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PaymentModal({ setShowModal, onAddedGateway, gatewayToEdit }) {
  const isEditMode = !!gatewayToEdit;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Pre-fill in edit mode
  useEffect(() => {
  if (isEditMode) {
    let details = {};
    try {
      details = gatewayToEdit.details
        ? typeof gatewayToEdit.details === "string"
          ? JSON.parse(gatewayToEdit.details) // parse if string
          : gatewayToEdit.details              // already object
        : {};
    } catch (e) {
      details = {};
      console.error("Failed to parse details:", e);
    }

    reset({
      name: gatewayToEdit.name || '',
      type: gatewayToEdit.type || '',
      account_no: details.account_no || '',  
      bank: details.bank || '',              
      status: gatewayToEdit.status || 'active',
    });
  }
}, [gatewayToEdit, reset, isEditMode]);


  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; }
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      type: data.type,
      details: {
        account_no: data.account_no,
        bank: data.bank,
      },
      status: data.status,
    };

    const token = localStorage.getItem('authToken');
    try {
      const response = isEditMode
        ? await axios.patch(`${API_BASE_URL}/offline-payment/${gatewayToEdit.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          })
        : await axios.post(`${API_BASE_URL}/offline-payment`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });

      const gatewayId = response.data.id || gatewayToEdit.id;

      const updatedGateway = {
        id: gatewayId,
        ...payload,
        details: JSON.stringify(payload.details),
      };

      onAddedGateway(updatedGateway);
      toast.success(response.data.message);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="modal fade show" tabIndex="-1" role="dialog"
         onClick={() => setShowModal(false)}
         style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-simple modal-dialog-centered" role="document"
           onClick={(e) => e.stopPropagation()}>
        <div className="modal-content p-2">
          <div className="modal-body">
            <button type="button" className="btn-close"
                    onClick={() => setShowModal(false)}
                    style={{ top: '-0.1rem', right: '0.3rem' }}></button>
            <div className="mb-6">
              <h5 className="mb-2">{isEditMode ? 'Edit Payment Gateway' : 'Add Payment Gateway'}</h5>
            </div>
            <form className="row g-5" onSubmit={handleSubmit(onSubmit)}>
              <div className='col-12 d-flex align-items-center'>
                <div className='col-6 pe-2'>
                  <label className='form-label'>Name</label>
                  <input type='text' className='form-control'
                    {...register('name', { required: 'Name is required' })} />
                  {errors.name && <span className="text-danger small">{errors.name.message}</span>}
                </div>
                <div className='col-6 ps-2'>
                  <label className='form-label'>Type</label>
                  <select className='form-control'
                    {...register('type', { required: 'Type is required' })}>
                    <option value="">Select Type</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  {errors.type && <span className="text-danger small">{errors.type.message}</span>}
                </div>
              </div>
              <div className='col-12 d-flex align-items-center'>
                <div className='col-6 pe-2'>
                  <label className='form-label'>Account Number</label>
                  <input type='text' className='form-control'
                    {...register('account_no', { required: 'Account no is required' })} />
                  {errors.account_no && <span className="text-danger small">{errors.account_no.message}</span>}
                </div>
                <div className='col-6 ps-2'>
                  <label className='form-label'>Bank Name</label>
                  <input type='text' className='form-control'
                    {...register('bank', { required: 'Bank Name is required' })} />
                  {errors.bank && <span className="text-danger small">{errors.bank.message}</span>}
                </div>
              </div>
              <div className='col-12 d-flex flex-column'>
                <label className='form-label'>Status</label>
                <select className='form-control'
                  {...register('status', { required: 'Status is required' })}>
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.status && <span className="text-danger small">{errors.status.message}</span>}
              </div>
              <div className="col-12 d-flex align-items-center justify-content-end">
                <button type="reset" className="btn btn-label-secondary me-3"
                        onClick={() => setShowModal(false)}>Close</button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
