module.exports=(io)=>{
    io.on("connection", function (socket) {
        console.log("User: ",socket.id)
        socket.on("messageSent", function (message) {
            socket.broadcast.emit("messageSent", message);
        });
    });
}