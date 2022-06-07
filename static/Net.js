const defaultFetch = {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	}
};

export const loginToServer = (nickname, callback = (data) => {}) => {
	fetch("/loginToServer", { ...defaultFetch, body: JSON.stringify({ nickname }) })
		.then((response) => response.json())
		.then((data) => {
			callback(data);
		});
};

export const reset = () => {
	fetch("/reset", { ...defaultFetch })
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		});
};

export const getActiveUsers = (callback = (data) => {}) => {
	fetch("/getActiveUsers", { ...defaultFetch })
		.then((response) => response.json())
		.then((data) => callback(data));
};
