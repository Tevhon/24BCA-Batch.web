const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    // lerp: 1 
});

var typed = new Typed('.Typejs', {
    strings: ["Notes", "Assignments", "PYQ Paper", "Teachers Info"],
    typeSpeed: 70,
    backSpeed: 70,
    loop: true,
    loopCount: Infinity,

});

let quote = document.getElementById("quote")

const key = `4uPj44izsym8mzugwCJTYA==sFxCUvYuUXEbXcUQ`
const catagory = `happiness`
const url = `https://api.api-ninjas.com/v1/quotes?category=${catagory}`

fetch(url,{
    headers:{
        'Content-Type':'application/json',
        'X-Api-Key': key
    }
}).then(res => res.json().then(data => {
    quote.textContent = data[0].quote
}))
