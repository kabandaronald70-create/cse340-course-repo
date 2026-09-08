const showHomePage = (req, res) => {
    const title = 'Home';
    const description = 'Connect with volunteers and discover service opportunities through the CSE 340 Service Network.';
    res.render('home', { title, description });
};

export { showHomePage };