module.exports = {
    port:3000,
    session:{
        secret:'myblog',
        key:'mtblog',
        maxAge: 2592000000
    },
    mongodb:'mongodb://localhost:27017/blogDb'
};