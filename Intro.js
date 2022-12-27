const sections = document.querySelectorAll('[id*=section]')
const options = {
    root: null, //it is the viewport
    threshold: 0.25, //0-1 scale
    rootMargin: "0px" //pulls margin of item to center so that observer fires earlier
};
const observer = new IntersectionObserver(function(entries,observer){
    entries.forEach(entry => {
        // console.log(entry.target)
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }else{entry.target.classList.remove('show');}
    })
},options)

sections.forEach(section => {observer.observe(section)})
