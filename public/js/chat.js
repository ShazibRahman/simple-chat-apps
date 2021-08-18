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




socket.on('message', (message_) => {

    const html = Mustache.render(messageTemplate, {
        username: message_.username,
        message: message_.text,
        createdAt: moment(message_.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend', html)


    if (username.toLowerCase() !== message_.username.toLowerCase()) {


        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        else if (Notification.permission === "granted") {
            var notification = new Notification(message_.username, {
                body: message_.text,
                icon: './img/favicon.png'
            });
        }

        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification(message_.username, {
                        body: message_.text,
                        icon: './img/favicon.png'
                    })
                }
            })
        }
    }
})

socket.on('sendLocation', (message) => {
    // console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,

        createdAt: moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)

    if (username.toLowerCase() !== message_.username.toLowerCase()) {

        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        else if (Notification.permission === "granted") {
            var notification = new Notification(message.username, {
                body: message.url,
                icon: './img/favicon.png'
            });
        }

        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification(message.username, {
                        body: message.url,
                        icon: './img/favicon.png'
                    })
                }
            })
        }

    }
})

socket.on('roomData', ({ room, users }) => {
    // console.log(users);
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar-1').innerHTML = html
})

socket.on('abuseAlert', () => {
    alert('Thand rakh bhai')
    $messageFormInput.value = ""
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