function showAdminDashboard(req, res) {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        description: 'Administrator tools for the CSE 340 Service Network.'
    });
}

export { showAdminDashboard };