module.exports = [
    'get / => home#main',
    'get /:id/:year/:month/:day => home#index',
    {
        rest: true,
        resource: 'blogs'
    },
    'post /login => account#verify',
    {
        area: 'admin',
        routes: [
            'get / => home#index'
        ]
    }
];
