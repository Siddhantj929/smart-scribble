import React, { useState, useRef } from "react";

const SignForm = () => {
	const [loginStatus, setLoginStatus] = useState(true);
	const nameRef = useRef();
	const emailRef = useRef();
	const passRef = useRef();

	const handleStatusSwitch = () => setLoginStatus(!loginStatus);

	const handleRequest = () => {
		let route = "/api/users/login";
		let body = {
			email: emailRef.current.value,
			password: passRef.current.value
		};

		if (!loginStatus) {
			route = "/api/users";
			body.name = nameRef.current.value;
		}

		fetch(route, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(raw => raw.json())
			.then(data => {
				// Success
				if (data.status == 200 || data.status == 201) {
					// Handle route change
				}
			})
			.catch(err => console.log(err));
	};

	return (
		<div className="SignForm bg-secondary">
			<div className="container">
				<img src={require("../../logo.svg")} alt="" />
				<div className="card animated fadeIn slow">
					<div className="card-header text-center">
						<div className="card-title h5">
							{loginStatus ? "Login" : "Sign Up"}
						</div>
						<div className="card-subtitle text-gray">
							Enter your credentials
						</div>
					</div>
					<div className="card-body">
						<form>
							{!loginStatus && (
								<div className="form-group animated fadeInUp">
									<label className="form-label" for="name">
										Name
									</label>
									<input
										className="form-input"
										type="name"
										id="name"
										placeholder="John Doe"
										ref={nameRef}
									/>
								</div>
							)}
							<div className="form-group animated fadeInUp">
								<label className="form-label" for="email">
									Email
								</label>
								<input
									className="form-input"
									type="email"
									id="email"
									placeholder="john@doe.com"
									ref={emailRef}
								/>
							</div>
							<div className="form-group animated fadeInUp">
								<label className="form-label" for="password">
									Password
								</label>
								<input
									className="form-input"
									type="password"
									id="password"
									placeholder="Password"
									ref={passRef}
								/>
							</div>
						</form>
					</div>
					<div className="card-footer">
						<button className="btn btn-primary">
							{loginStatus ? "Login" : "Sign Up"}
						</button>
						<a
							class="text-primary"
							href="#"
							onClick={handleStatusSwitch}
						>
							{loginStatus ? "Sign Up?" : "Login?"}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignForm;
