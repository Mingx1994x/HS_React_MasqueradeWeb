import { useEffect } from "react"

const Pagination = ({ setCurrentPage, pageState, setPageState, totalPages, currentPage }) => {

	const switchCurrentPage = (mode) => {
		if (mode === 'next') {
			setCurrentPage(currentPage + 1)
		} else {
			setCurrentPage(currentPage - 1)
		}
	}

	useEffect(() => {
		if (currentPage === 1) {
			setPageState({
				previous: false,
				next: true,
			})
		} else if (currentPage === totalPages) {
			setPageState({
				previous: true,
				next: false,
			})
		} else {
			setPageState({
				previous: true,
				next: true,
			})
		}
	}, [currentPage])

	return (
		<nav>
			<ul className="pagination justify-content-center">
				<li className={`page-item ${!pageState?.previous && 'disabled'}`}>
					<a className="page-link" onClick={(e) => {
						e.preventDefault();
						switchCurrentPage('prev')
					}}>Previous</a>
				</li>
				{[...Array(totalPages).keys()].map(page =>

				(<li className={`page-item ${page + 1 === currentPage && 'active'}`} key={page}>
					<a className="page-link" href="#" onClick={(e) => {
						e.preventDefault();
						setCurrentPage(page + 1);
					}}>{page + 1}</a>
				</li>)
				)}
				<li className={`page-item ${!pageState?.next && 'disabled'}`}>
					<a className="page-link" href="#" onClick={(e) => {
						e.preventDefault();
						switchCurrentPage('next')
					}}>Next</a>
				</li>
			</ul>
		</nav>
	)
}

export default Pagination