class UserManager{
    constructor(){
        this.users = [];
    }

    addUser(user){
        this.users.push(user);
    };
    
    getUser(){
        return this.users;
    }
    
    removeUser(socketID){
        const index = this.users.findIndex((user)=>user.socketID === socketID);
        if(index !== -1){
            return this.users.splice(index, 1)[0];
        }
    }
}

export const userManager = new UserManager();