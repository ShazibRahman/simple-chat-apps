const users = []
const rooms =[]

// addUser , removeUser , getUser , getUsersInRoom

const addIfNotRoom = ({room , password})=>{
 
    if (password=== undefined){
       password="default" 
       
    }
    const existingRoom =  rooms.find((x)=>{
        return x.name === room
    })
    if (existingRoom){
        return existingRoom.password === password
    }
    else{
        rooms.push({
            name:room,
            password:password
        })
        return true
    }
}
const addUser = ({ id, username, room ,password }) => {
    //clean the data 
    if (!username || !room) {
        return {
            error: 'userName and room must be provided'

        }
    }
    
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

  

    //validate the data 


    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username

    })
    

    // validate the userName 
    if (existingUser) {
        return {
            error: 'UserName already taken'
        }
    }

    const passwordVerification =  addIfNotRoom({room ,password})
    if (!passwordVerification){
        return {
            "error":"Wrong password"
        }
    }
    const user = { id, username, room }
    users.push(user)
    return { user }
    
    

}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id)


}

const getUsersInRoom = (room) => {
    room = room.trim()
    return users.filter(user => user.room === room)
}




module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
