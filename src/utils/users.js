const users = []

// addUser , removeUser , getUser , getUsersInRoom


const addUser = ({ id, username, room }) => {
    //clean the data 
    if (!username || !room) {
        return {
            error: 'userName and room must be provided'

        }
    }

    username = username.trim().toLowerCase()
    room = room.trim()

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
