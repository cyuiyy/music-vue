import request from "@/utils/request"

let api={
    user:{
        login:(data)=>request.post('/api/login',data),
        registry:(data)=>request.post('/api/registry',data)
    },
    music:{
        getInfo:()=>request.get('/api/userinfo'),
        getList:(data)=>request.get('/api/querymusic',data),
        addMusic:(data)=>request.post('/api/addmusic',data),
        upImg:(data)=>request.post('/api/upload',data),
        remove:(data)=>request.get('/api/deletemusic',data),
        upData:(data)=>request.post('/api/updatemusic',data)
    }
}

export default api