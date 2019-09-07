import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        musicList:[],
        flag:false
    },
    mutations:{
        getDataFn(state,musicList){
            state.musicList=musicList
        },
        deleteItem(state,id){
            console.log(state.musicList,id)
            let index = state.musicList.find(item =>item.id===id)
            state.musicList.splice(index,1)
        }
    },
    actions:{
        getData({commit},obj){
            commit("getDataFn",obj)
        },
        remove({commit},id){
            commit('deleteItem',id)
        }   
    }
})