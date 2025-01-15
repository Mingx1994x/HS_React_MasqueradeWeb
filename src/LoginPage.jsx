
function Login({ account, login, inputHandler }) {

	return (
		<div className="loginPhase">
			<div className="row">
				<div className="col-md-6 col-lg-8">
					<form className='card' onSubmit={(e) => {
						e.preventDefault();
						login()
					}}>
						<div className="card-body">
							<div className="mb-3">
								<div className="form-floating">
									<input type="email" name='username' className="form-control" id="floatingInput"
										value={account?.username}
										placeholder="name@example.com"
										onChange={inputHandler} />
									<label htmlFor="floatingInput">Email</label>
								</div>
							</div>

							<div className="mb-3">
								<div className="form-floating">
									<input type="password" name='password' className="form-control" id="floatingPassword"
										value={account?.password}
										placeholder="Password"
										onChange={inputHandler} />
									<label htmlFor="floatingPassword">Password</label>
								</div>
							</div>
							<div className="d-flex mb-3">
								<button className='btn btn-primary mx-auto'>登入</button>
							</div>
							<p className="text-center text-secondary">&copy; 2025~∞ - 六角學院</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Login