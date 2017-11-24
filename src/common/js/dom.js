export const addClass = (el, className) => {
    if(hassClass(el, className)) {
        return;
    }

    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}

export const hassClass = (el, className) => {
    let reg = new RegExp('(^|\\s)'+ className +'(\\s|$)');
    return reg.test(el.className);
}

