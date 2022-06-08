function isObject(value) {
	return typeof value === "object" && value != null;
}

export class AmogElement {
	mount(element) {}

	render() {
		throw new Error("Unimplemented render() method");
	}
}

function applyProp(target, prop, value) {
	//console.log("applyProp:", prop, value, "on", target);
	if (isObject(value)) {
		applyProps(target[prop], value);
	} else {
		target[prop] = value;
	}
}

function applyProps(target, props) {
	//console.log("applyProps:", props, "on", target);
	if (isObject(props)) {
		for (const prop in props) {
			const value = props[prop];
			applyProp(target, prop, value);
		}
	} else {
		throw new Error("`attributes` must be an object!");
	}
}

function childToNode(child) {
	if (child == null) {
		return document.createComment("child placeholder");
	} else if (child instanceof AmogElement) {
		const element = child.render();
		element.$amog = child;
		return element;
	} else if (child instanceof HTMLElement) {
		return child;
	} else if (typeof child === "string") {
		return document.createTextNode(child);
	} else {
		return document.createTextNode(JSON.stringify(child));
	}
}

export function createElement(tag, attributes, ...children) {
	const element = document.createElement(tag);
	applyProps(element, attributes);

	for (const child of children) {
		element.appendChild(childToNode(child));
	}
	return element;
}

function notifyMount(element) {
	for (const child of element.children) {
		child.$amog?.mount(child);
		notifyMount(child);
	}
}

export function mount(element, target) {
	target.appendChild(childToNode(element));
	notifyMount(target);
}

export function editElement(target, ...children) {
	removeChildren(target);
	for (const child of children) {
		target.appendChild(childToNode(child));
	}
}

function removeChildren(target) {
	while (target.firstChild) {
		target.removeChild(target.lastChild);
	}
}

export function removeElements(...targets) {
	for (const target of targets) target.remove();
}
