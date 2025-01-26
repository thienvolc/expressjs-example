export class StaticMethodDecorator {
    constructor(decorator) {
        console.log(typeof decorator);
        this.decorator = decorator;
    }

    decorateAllStaticMethods = (Class) => {
        return new Proxy(Class, {
            get: (target, property) => {
                if (StaticMethodDecorator.isStaticMethod(target, property)) {
                    return this.decorator(target[property]);
                }
                return target[property];
            },
        });
    };
    static isStaticMethod(Class, method) {
        return typeof Class[method] === 'function' && method !== 'prototype' && method !== 'constructor';
    }
}
