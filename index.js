var option = {
    mode: "rtc",
    codec: "vp8",
    appid: "fbe2f85e7c2e4a829c0d186a7760ae0b",
    channel: null,
    uid: null
}

var rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    params: {}
}

var client = AgoraRTC.createClient({mode: option.mode, codec: option.codec})

function join(rtc, option) {
    rtc.client = client
    rtc.params = option

    // init client
    rtc.client.init(option.appid, function () {
        console.log("init success")
    
        rtc.client.join(option.appid, option.channel, null, null) 

            // create local stream
            rtc.localStream = AgoraRTC.createStream({
                streamID: rtc.params.uid,
                audio: true,
                video: true,
                screen: false,
            })
        // initialize local stream. Callback function executed after intitialization is done
        rtc.localStream.init(function () {
            console.log("init local stream success")
            // play stream with html element id "local_player"
            rtc.localStream.play("local-player")
            
            // publish local stream
            publish(rtc)
        })
    }
)}

function publish (rtc) {
    rtc.client.publish(rtc.localStream, function (err) {
        console.log("publish failed")
        console.error(err)
    })
}

// Link join function to join button and add channel
$("#join-form").submit(async function(e){
    // The default would be to reload the page; we are preventing that
    e.preventDefault();
    if ($("#emailText").val().match(/\S+@\S+/)){
        document.getElementById("emailText").setAttribute("class", "border-primary")
        if ($("#passwordText").val().length == 0) {
            document.getElementById("passwordText").setAttribute("class", "border-danger")
        }
        else {
            document.getElementById("passwordText").setAttribute("class", "border-primary")
            option.channel = $("#channel").val()
            option.uid = await client.join(option.appid, option.channel, null, null)
            console.log(option.uid)
        try{
            console.log(option)
            join(rtc, option);
        } catch(e) {
            console.error(e)
        }
        }
    }
    else {
        document.getElementById("emailText").setAttribute("class", "border-danger")
    }
});