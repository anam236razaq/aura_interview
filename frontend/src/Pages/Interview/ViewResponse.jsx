import { useLocation } from 'react-router-dom';
import Footer from '../../UI/Footer';

export default function ViewResponse() {
    const location = useLocation();
    const candidate = location.state?.candidate;

    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
            {candidate ? (
                <div>
                    <h5 className="text-black mb-5" style={{fontSize: '22px'}}>
                        Candidate: {candidate.name}
                    </h5>
                    <div className="row g-4">
                        {candidate.responses?.length ? (
                            candidate.responses.map((response, i) => (
                                <div className="col-md-6 col-lg-4" key={i}>
                                    <div className="card h-100">
                                        <div className="card-header">Question {i + 1}</div>
                                        <div className="card-body">
                                            <h5 className="card-title">{response.questionText || 'No question text'}</h5>
                                            <p><strong>Type:</strong> {response.type}</p>

                                            {response.type === 'text' && (
                                                <p><strong>Response:</strong> {response.content}</p>
                                            )}

                                            {response.type === 'video' && response.content && (
                                                <div>
                                                    <strong>Response:</strong><br />
                                                    <video className='mt-1' src={response.content} controls width="100%" />
                                                </div>
                                            )}

                                            {response.type === 'file' && response.content && (
                                                <p><strong>Response:</strong> <a href={response.content} target="_blank" rel="noopener noreferrer">View File</a></p>
                                            )}

                                            {!response.content && <p><em>No response content available.</em></p>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='tex-black d-flex align-items-center justify-content-between mt-4'>No responses available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className='tex-black d-flex align-items-center justify-content-between mt-4'>Candidate not found.</p>
            )}
            </div>
            <Footer />
            <div className="content-backdrop fade"></div>
        </div>
    );
}
