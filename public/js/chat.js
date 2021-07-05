const socket = io()


const $messageForm = document.querySelector('#myForm')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormInput = $messageForm.querySelector('input')
const $sendLocationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector("#room-list").innerHTML
//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', (message_) => {
    console.log(message_)
    const html = Mustache.render(messageTemplate, {
        username: message_.username,
        message: message_.text,
        createdAt: moment(message_.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll()
})

socket.on('sendLocation', (message) => {
    // console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,

        createdAt: moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    // console.log(users);
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar-1').innerHTML = html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    //disable accidental dual message

    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)

        }
        return console.log('message delivered')

    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your broswer')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((postion) => {
        socket.emit('sendLocation', {
            la: postion.coords.latitude,
            lg: postion.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared');
        })


    })


})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)

        location.href = "/"



    }

})