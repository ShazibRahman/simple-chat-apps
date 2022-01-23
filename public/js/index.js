function Myfunc(checkboxElem){
    var container = document.getElementById("divpass")

    if(checkboxElem.checked){
        var label = document.createElement("label")
        label.innerText="Room password"
        var input = document.createElement("input")
        input.type="password"
        input.id="room-password-text"
        input.name="password"
        label.id="room-password-label"
        container.appendChild(label)
        container.appendChild(input)


        
    }
    else{
        var label =document.getElementById("room-password-label")
        var input = document.getElementById("room-password-text")
        container.removeChild(label)
        container.removeChild(input)

    }
}
