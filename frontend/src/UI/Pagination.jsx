
export default function Pagination({currentPage, itemsPerPage, list, handlePageChange, totalPages}) {

  return (
    <div className="row mx-3 justify-content-between">
        <div className="mt-0 mt-sm-4 d-md-flex align-items-center dt-layout-start col-md-auto me-auto d-flex justify-content-md-between justify-content-center">
            <div className="dt-info" aria-live="polite" id="DataTables_Table_0_info" role="status">
                {`Showing ${(currentPage - 1) * itemsPerPage +1} to ${Math.min(currentPage * itemsPerPage, list.length)} of ${list.length} entries`}
            </div>
        </div>
        <div className="me-4 mt-4 d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
            <div className="dt-paging">
                <nav aria-label="pagination">
                    <ul className="pagination">
                        <li className={`dt-paging-button page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link previous" role="link" type="button" aria-controls="DataTables_Table_0" aria-label="Previous" onClick={()=> handlePageChange(currentPage-1)}>
                                <i className="icon-base ti tabler-chevron-left scaleX-n1-rtl icon-18px"></i>
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li className={`dt-paging-button page-item ${currentPage === index+1 ? "active" : ""}`} key={index}>
                                <button className="page-link me-1" role="link" type="button" aria-controls="DataTables_Table_0" onClick={()=> handlePageChange(index+1)}>{index+1}</button>
                            </li>
                        ))}
                        <li className={`dt-paging-button page-item  ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link next" role="link" type="button" aria-controls="DataTables_Table_0" aria-label="Next" onClick={()=> handlePageChange(currentPage+1)}>
                                <i className="icon-base ti tabler-chevron-right scaleX-n1-rtl icon-18px"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
  )
}
