export const addClass = (el, className) => {
    if (hasClass(el, className)) {
        return;
    }

    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}

export const hasClass = (el, className) => {
    let reg = new RegExp('(^|\\s)'+ className +'(\\s|$)');
    return reg.test(el.className);
}

export const removeClass = (el, className) => {
    if (!hasClass(el, className)) {
        return;
    }
    let reg = new RegExp('(^|\\s)'+ className +'(\\s|$)');
    el.className = el.className.replace(reg, '');
}


export const getData = (el, name, val) => {
    const prefix = 'data-';
    name = prefix + name;
    if (val) {
        return el.setAttribute(name, val);
    } else {
        return el.getAttribute(name);
    }
}
