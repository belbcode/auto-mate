console.log("Content script loaded successfully");

function iterateDOM(element, callback) {
    let child = element?.firstChild
    while (child) {
        if (child.nodeType === 1) {
            callback(child)
            iterateDOM(child, callback)
        }
        child = child.nextSibling
    }
}

const contentfulElements = []
const eventList = []


const countContentfulElements = (element) => {
    let child = element.firstChild
    while(child) {
        if(child.nodeType === 3) {
            contentfulElements.push(element)
            return
        }
        child = child.nextSibling

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getRootNode()
    iterateDOM(root, countContentfulElements)

    var elements = document.querySelectorAll('*');
  
    // Log the number of elements
    console.log('Number of elements:', elements.length);



    document.getElementById('record').addEventListener('click', (e) => {
        console.log("recording");
        contentfulElements.forEach(element => {
            addListeners(element, eventList)
        })
    })


    document.getElementById('pause').addEventListener('click', (e) => {
        console.log("paused")
        contentfulElements.forEach(element => {
            removeListeners(element)
         })
    })

    document.getElementById('play').addEventListener('click', (e) => {
        console.log("these should play")
        console.log(eventList)
        const newList = eventList.map(ev => ev)
        newList.forEach(event => {
            simulate(event.target, event.type, event)
        });
    })
})


const pushToList = (e) => {
    console.log('event is being recorded')
    eventList.push(e)
}

function addListeners(element, eventList) {
    const eventMatchers = {
        HTMLEvents : ["load","unload","abort","error","select","change","submit","reset","focus","blur","resize", "scroll", "input"],
        MouseEvents : ["click","dblclick"]
    }
    for(const event of eventMatchers["HTMLEvents"]) {
        element.addEventListener(event, pushToList)
    }
    for(const event of eventMatchers["MouseEvents"]) {
        element.addEventListener(event, pushToList)
    }
}
function removeListeners(element) {
    const eventMatchers = {
        HTMLEvents : ["load","unload","abort","error","select","change","submit","reset","focus","blur","resize", "scroll", "input"],
        MouseEvents : ["click","dblclick"]
    }
    for(const event of eventMatchers["HTMLEvents"]) {
        element.removeEventListener(event, pushToList)
    }
    for(const event of eventMatchers["MouseEvents"]) {
        element.removeEventListener(event, pushToList)
    }

}

function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;
    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            if(eventName==="keypress") {
                options.target.value = options.target.value
            }
            oEvent.initEvent(eventName, false, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll|input)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}
