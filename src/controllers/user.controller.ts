exports.test = async (req, res) => {
	try {
		res.status(200).send('Test yes 2');
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
};
